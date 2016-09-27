'use strict';

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var jslint = require('gulp-jslint');
var sass = require('gulp-sass');
var sourceMaps = require("gulp-sourcemaps");

var FILES = {
	css: 'css/',
	sass: 'css/sass/**/*.scss',
	'js':'js/main.js',
	'js-folder': 'js/'
};


// Server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

// SASS
gulp.task('sass', function(){
  return gulp.src(FILES.sass)
    .pipe( sourceMaps.init() )
    .pipe( sass().on('error', swallowError ) )
    .pipe( sourceMaps.write("./") )    
    .pipe( gulp.dest(FILES.css) )
    .pipe(browserSync.reload({
      stream: true
    }));
});

// JSLint
gulp.task('jslint', function () {
    return gulp.src([FILES.js])
            .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
            .pipe(jslint.reporter( 'my-reporter' ));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch( FILES.js, ['jslint'] );
	gulp.watch( FILES.sass, ['sass'] );
});

gulp.task('default', ['watch']);

function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString())

  this.emit('end')
}