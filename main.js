requirejs.config( {
    baseUrl: 'modules'
} );

require( [ 'midi-events' ], function( midi ) {
	var grid = createGrid(),
		ships = [],
		shipsFound = [],
		explored = [],
		isPlaying = false,
		numberOfPositions = 5,
		outputPort = 4;
	
	// Connect and run init function when connected.
	midi.connect();
	midi.on( 'connected', init );
	
	// Initialize.
	function init() {
		midi.listen();
		
		// Listen for pressed buttons.
		midi.on( 'noteon', function( message ) {
			// Bail if no active game.
			if ( !isPlaying ) { return; }
			
			// Check, and bail, if button has already been pressed.
			if ( explored.indexOf( message.note ) === -1 && shipsFound.length < ships.length ) {
				midi.send( outputPort, {
					type: 'noteon',
					note: message.note,
					value: 63
				} );
			}
		} );
		
		// Listen for released buttons.
		midi.on( 'noteoff', function( message ) {
			// Bail if no active game.
			if ( !isPlaying ) { return; }
			
			// Check, and bail, if button has already been pressed.
			if ( explored.indexOf( message.note ) === -1 ) {
				var sendMessage = {
					type: 'noteon',
					note: message.note,
					value: 0
				};
				
				// Check if position contains ship.
				if ( ships.indexOf( message.note ) > -1 ) {
					sendMessage.value = 60;
					
					// Add ship position to array of found ships.
					shipsFound.push( message.note );
					
					// Check if all ships have been found.
					if ( shipsFound.length === ships.length ) {
						isPlaying = false;
					}
				}
				
				// Send response.
				midi.send( outputPort, sendMessage );
				
				// Add position to array of explored positions.
				explored.push( message.note );
			}
		} );
		
		// Raise number of ships in game.
		midi.on( 'controller:104', function( message ) {
			// Bail if no active game.
			if ( !isPlaying ) { return; }
			
			// If button is pressed.
			if ( message.value === 127 && numberOfPositions < 32 ) {
				numberOfPositions++;
			}
		} );
		
		// Lower number of ships in game.
		midi.on( 'controller:105', function( message ) {
			// Bail if no active game.
			if ( !isPlaying ) { return; }
			
			// If button is pressed.
			if ( message.value === 127 && numberOfPositions > 4 ) {
				numberOfPositions--;
			}
		} );
		
		// Launch new game.
		newGame();
	}
	
	// Main functionality.
	function newGame() {
		// Start new game.
		isPlaying = true;
		
		// Empty array of explored positions and found ships.
		explored = [];
		shipsFound = [];
		
		// Add ships to grid.
		ships = randomPositions( numberOfPositions );
		
		// Make all buttons yellow.
		allYellow();
	}
	
	// Funtion to map the grid of the Launchpad.
	function createGrid() {
		var positions = [],
			i,
			j;
		
		// Go through each row.
		for ( i = 0; i < 8; i++ ) {
			// Go through each button in row.
			for ( j = 0; j < 8; j++ ) {
				positions.push( i * 16 + j );
			}
		}
		
		// Return positions.
		return positions;
	}
	
	// Get a number of random positions in grid.
	function randomPositions( number ) {
		var number = number === undefined ? 5 : number,
			randomGrid = [],
			positions = [],
			i;
		
		// Create random grid positions array from grid variable.
		randomGrid = grid.sort( function() { return 0.5 - Math.random() } );
		
		// Get a number of positions from random array.
		for ( i = 0; i < number; i++ ) {
			positions.push( grid[ i ] );
		}
		
		// Return random positions.
		return positions;
	}
	
	// Light all of the buttons yellow.
	function allYellow() {
		var messages = [],
			i;
		
		// Add message for each button in grid.
		for ( i = 0, length = grid.length; i < length; i++ ) {
			messages.push( {
				type: 'noteon',
				note: grid[ i ],
				value: 29
			} );
		}
		
		// Send messages to device.
		midi.send( outputPort, messages );
	}
} );