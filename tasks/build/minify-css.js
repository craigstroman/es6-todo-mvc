'use strict';

var cleanCSS = require('gulp-clean-css');
var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('minify-css', function() {
    return gulp.src('./src/css/styles.css')
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist/css/'));
});