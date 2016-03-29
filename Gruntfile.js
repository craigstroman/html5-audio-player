module.exports = function(grunt) {
	// this is where all the grunt configs will go
	grunt.initConfig({	
		//read the package.json file
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				files: {
					'css/styles.css' : 'css/sass/styles.scss'
				}
			}
		},	

		watch: {
			css: {
				files: 'css/sass/**/*.scss',
				tasks: ['sass']
			}
		}			
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');	

	grunt.registerTask('watch-css',['watch']);
};