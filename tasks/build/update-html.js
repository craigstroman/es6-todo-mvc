'use strict';

import gulp from 'gulp';
import htmlreplace from 'gulp-html-replace';

gulp.task('update-html', () => {
    gulp.src('./src/*.html', {base: "./src"})
    .pipe(htmlreplace({
        "css": "css/styles.min.css",
        "js-app": "js/main.min.js",
    }))
    .pipe(gulp.dest("./dist/"));
});