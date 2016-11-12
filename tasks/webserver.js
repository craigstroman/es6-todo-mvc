'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    var src = (argv.production) ? './dist/' : './src/';

    gulp.src(src)
        .pipe(webserver({
          livereload: true,
          fallback: src + 'index.html'
      }));
});