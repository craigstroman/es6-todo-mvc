'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import requireDir from 'require-dir';

// Pulling in all tasks from the tasks folder
requireDir('./tasks', { recurse: true });

// Define the server task.
gulp.task('server', ['webserver']);

// Define the default task.
gulp.task('default', ['watch']);

// Define the build task.
gulp.task('build', ['minify-js', 'minify-css', 'update-html']);