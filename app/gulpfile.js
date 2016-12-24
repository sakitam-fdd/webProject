/**
 * Created by FDD on 2016/12/24.
 */
'use strict';
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify');
// Load plugins
var $ = require('gulp-load-plugins')();

/* es6 */
gulp.task('es6', function() {

  return gulp.src('src/ES6Script/*.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build/'));
});