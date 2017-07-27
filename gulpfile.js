'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var uglify = require("gulp-uglifyjs");
var buble = require('gulp-buble');
var replace = require('gulp-replace');
var include = require("gulp-include");
var concat = require("gulp-concat");
var header = require("gulp-header");
var size = require("gulp-size");

var Server = require("karma").Server;

var comment = `/**
 * Moon Router v${pkg.version}
 * Copyright 2016-2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/KingPixil/moon-router
 */\r\n`;

// Build Moon Router
gulp.task('transpile', function () {
  return gulp.src(['./src/index.js'])
    .pipe(include())
    .pipe(buble())
    .pipe(concat('moon-router.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['transpile'], function () {
  return gulp.src(['./src/wrapper.js'])
    .pipe(include())
    .pipe(concat('moon-router.js'))
    .pipe(header(comment + '\n'))
    .pipe(replace('__VERSION__', pkg.version))
    .pipe(size())
    .pipe(gulp.dest('./dist/'));
});

// Build minified (compressed) version of Moon Router
gulp.task('minify', ['build'], function() {
  return gulp.src(['./dist/moon-router.js'])
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(size())
    .pipe(size({
      gzip: true
    }))
    .pipe(concat('moon-router.min.js'))
    .pipe(gulp.dest('./dist/'));
});

// Run tests
gulp.task('test', function(done) {
    new Server({
      configFile: __dirname + '/test/karma.conf.js',
      singleRun: true
    }, done).start();
});

// Default task
gulp.task('default', ['build', 'minify']);
