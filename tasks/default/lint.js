'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

gulp.task('lint-js', function() {
    return gulp.src( ['./src/js/**/*.js', '!node_modules/**', '!./src/js/bundle.js'] )
        .pipe(plumber())
        .pipe( eslint() )
        .pipe( eslint.format() )
        .on('error', notify.onError('Error!'))
        .pipe( eslint.failOnError() );
});