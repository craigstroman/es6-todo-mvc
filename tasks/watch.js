'use strict';

import gulp from 'gulp';

gulp.task('watch', () => {
    gulp.watch( './src/css/scss/**/*.scss', ['build-css']);
    gulp.watch(['./src/js/**/*.js', '!./src/js/bundle.js', '!./src/js/libs/**/*.js'], ['lint-js', 'babel']);
});