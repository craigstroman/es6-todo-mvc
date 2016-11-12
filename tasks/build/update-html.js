'use strict';

var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');

gulp.task('update-html', function() {
    gulp.src('./src/*.html', {base: "./src"})
        .pipe(htmlreplace({
            "css": "css/styles.min.css",
            "js-app": "js/main.min.js",
        }))
        .pipe(gulp.dest("./dist/"));
});