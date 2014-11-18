'use strict';

var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var mocha       = require('gulp-mocha');
var istanbul    = require('gulp-istanbul');
var packageJSON = require('./package');
var bookshelf   = require('./bookshelf');

var jshintConfig    = packageJSON.jshintConfig;
jshintConfig.lookup = false;

var filesToLint = [
    '**/*.js',
    '!./node_modules/**/*',
    '!./coverage/**/*'
];

gulp.task('lint', function() {
    return gulp.src(filesToLint)
    .pipe(jshint(packageJSON.jshintConfig))
    .pipe(jshint.reporter('default'));
});

var mochaOptions = {
    ui         : 'bdd',
    reporter   : 'dot',
    globals    : [],
    timeout    : 2000,
    bail       : true,
    ignoreLeaks: false
};

var testFiles = './test/**/*.test.js';

gulp.task('test', function() {
    return gulp.src(testFiles, {
        read: false
    })
    .pipe(mocha(mochaOptions))
    .once('end', function() {
        bookshelf.knex.destroy();
    });
});

var filesToCover = [
    '**/*.js',
    '!./node_modules/**/*',
    '!./coverage/**/*',
    '!./test/**/*',
    '!./config.js'
];

var reportsOptions = {
    dir: './coverage',
    reporters: [
        'html',
        'lcov',
        'text-summary'
    ]
};

gulp.task('test-cov', ['lint'], function(done) {
    gulp.src(filesToCover)
    .pipe(istanbul())
    .on('finish', function() {
        gulp.src(testFiles, {
            read: false
        })
        .pipe(mocha(mochaOptions))
        .pipe(istanbul.writeReports(reportsOptions))
        .once('end', function() {
            bookshelf.knex.destroy();
        });
    });
});
