'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';

// Handle Gulp errors.
const errorHandler = () => {
   return function plumber(error) {
        // Output an error message
        gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
        // emit the end event, to properly end the task
        this.emit('end');        
    }
};

export default errorHandler;
