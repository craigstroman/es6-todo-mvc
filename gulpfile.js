'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var requireDir = require('require-dir');

// Handle Gulp errors.
var gulp_src  = gulp.src;
gulp.src = function() {
    return gulp_src.apply(gulp, arguments)
        .pipe(plumber(function(error) {
          // Output an error message
          gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
          // emit the end event, to properly end the task
          this.emit('end');
        })
    );
};

// Pulling in all tasks from the tasks folder
requireDir('./tasks', { recurse: true });

// Define the server task.
gulp.task('server', ['webserver']);

// Define the default task.
gulp.task('default', ["watch"]);

// Define the build task.
gulp.task('build', ['minify-js', 'minify-css', 'update-html']);