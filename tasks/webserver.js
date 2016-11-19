'use strict';

import argv from 'yargs';
import gulp from 'gulp';
import webserver from 'gulp-webserver';

gulp.task('webserver', () => {
   let src = (argv.production) ? './dist/' : './src/';

    gulp.src(src)
         .pipe(webserver({
           livereload: true,
           fallback: src + 'index.html'
         }));
});