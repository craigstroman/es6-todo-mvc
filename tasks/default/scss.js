'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');

gulp.task('build-css', function() {
	return gulp.src( './src/css/scss/**/*.scss' )
		.pipe( sass() )
		.pipe( sourceMaps.init() )
		.pipe( sourceMaps.write('./') )
		.pipe( gulp.dest('./src/css/') );
});