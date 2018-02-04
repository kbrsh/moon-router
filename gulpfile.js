'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var uglify = require("gulp-uglifyjs");
var rollup = require("rollup-stream");
var buble = require("rollup-plugin-buble");
var stream = require("vinyl-source-stream");
var replace = require('gulp-replace');
var concat = require("gulp-concat");
var header = require("gulp-header");
var size = require("gulp-size");

var Server = require("karma").Server;

var comment = `/**
 * Moon Router v${pkg.version}
 * Copyright 2016-2018 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/moon-router
 */\r\n`;

// Build Moon Router
gulp.task("build", function() {
  return rollup({
    input: "./src/index.js",
    format: "umd",
    name: "MoonRouter",
    plugins: [buble({
      namedFunctionExpressions: false,
      transforms: {
        arrow: true,
        classes: false,
        collections: false,
        computedProperty: false,
        conciseMethodProperty: true,
        constLoop: false,
        dangerousForOf: false,
        dangerousTaggedTemplateString: false,
        defaultParameter: false,
        destructuring: false,
        forOf: false,
        generator: false,
        letConst: true,
        modules: false,
        numericLiteral: false,
        parameterDestructuring: false,
        reservedProperties: false,
        spreadRest: false,
        stickyRegExp: false,
        templateString: true,
        unicodeRegExp: false
      }
    })]
  })
    .pipe(stream("moon-router.js"))
    .pipe(header(comment + '\n'))
    .pipe(replace('__VERSION__', pkg.version))
    .pipe(gulp.dest('./dist/'));
});

// Build minified (compressed) version of Moon Router
gulp.task('minify', ['build'], function() {
  return gulp.src(['./dist/moon-router.js'])
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(concat('moon-router.min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(size())
    .pipe(size({
      gzip: true
    }));
});

gulp.task("es6", function() {
  return rollup({
    input: "./src/index.js",
    format: "es",
  })
    .pipe(stream("moon-router.esm.js"))
    .pipe(header(comment + "\n"))
    .pipe(replace('__VERSION__', pkg.version))
    .pipe(gulp.dest("./dist/"))
    .pipe(size());
});

// Run tests
gulp.task('test', function(done) {
    new Server({
      configFile: __dirname + '/test/karma.conf.js',
      singleRun: true
    }, done).start();
});

// Default task
gulp.task('default', ['build', 'minify', 'es6']);
