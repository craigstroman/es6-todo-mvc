'use strict';

import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

gulp.task('minify-js', () => {
    return gulp.src('./src/js/bundle.js')
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('./dist/js/'));
    });