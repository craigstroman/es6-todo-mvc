'use strict';

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import errorHandler from '../error';

gulp.task('lint-js', () => {
    return gulp.src( ['./src/js/**/*.js', '!node_modules/**', '!./src/js/bundle.js'] )
        .pipe( eslint() )
        .pipe( eslint.format() )
        .on('error', errorHandler(eslint))
        .pipe( eslint.failOnError() );
});