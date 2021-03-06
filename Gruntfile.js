module.exports = function(grunt) {
	// Configure Grunt and tasks.
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		
		// Settings for Compass.
		compass: {
			dist: {
				options: {
					config: './config.rb'
				}
			}
		},
		
		// Settings for ImageOptim.
		imageoptim: {
			optimize: {
				options: {
					jpegMini: false,
					imageAlpha: true,
					quitAfter: true
				},
				src: [ 'assets/img/' ]
			}
		},
		
		// Setup watcher.
		watch: {
			options: {
				livereload: true,
			},
			html: {
				files: [ '*.html', '*.php' ],
				tasks: [  ],
				options: {
					spawn: false,
				}
			},
			css: {
				files: [ 'assets/scss/**/*.scss' ],
				tasks: [ 'compass' ],
				options: {
					spawn: false,
				}
			},
			js: {
				files: ['asset/js/**/*.js'],
				tasks: [  ],
				options: {
					spawn: false,
				}
			}
		}
	} );

	// Load Grunt plugins.
	require( 'load-grunt-tasks' )( grunt );

	// Register tasks.
	grunt.registerTask( 'default', [ 'compass' ] );
};