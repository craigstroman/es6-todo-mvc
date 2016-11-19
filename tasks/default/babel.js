'use strict';

import babelify from 'babelify';
import browserify from 'browserify';
import bufffer from 'vinyl-buffer';
import gulp from 'gulp';
import errorHandler from '../error';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';

gulp.task('babel', ['lint-js'], () => {
    return browserify({
        entries: ['./src/js/app.js'],
        debug: true
    })
    .transform(babelify.configure({
        presets: ["es2015"]
    }))   
    .bundle()
    .on('error', errorHandler(browserify))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/js/'));
});