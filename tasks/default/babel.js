'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var bufffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil  = require("gulp-util");
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');

gulp.task('babel', ['lint-js'], function() {
    return browserify({
        entries: ['./src/js/app.js'],
        debug: true
    })
    .transform(babelify.configure({
        presets: ["es2015"]
    }))   
    .bundle()
    .pipe(plumber(function(e) {
        gutil.log(gutil.colors.red("Error (" + error.plugin + "): " + error.message));
        this.emit("end");
    }))    
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/js/'));
});