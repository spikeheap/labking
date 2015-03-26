(function(require){
    'use strict';

    var project = require('./package.json'),
        path = require('path'),
        distPath = path.join(__dirname, 'dist', project.name, 'web', project.name);

    // Load plugins
    var gulp = require('gulp'),
        less = require('gulp-less'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        del = require('del'),

        jshint = require('gulp-jshint'),
        jscs = require('gulp-jscs'),
        browserify = require('browserify'),
        transform = require('vinyl-transform'),
        babel = require('gulp-babel'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps');

    var browserified = transform(function(filename) {
      var b = browserify({entries: filename, debug: true});
      return b.bundle();
    });
     
    // Styles
    gulp.task('styles', function() {
      return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.join(distPath, 'styles')));
    });
     
    // Validate JavaScript
    gulp.task('scripts:validate', function() {
      return gulp.src('./js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(jscs());
    });
    
    // Build JavaScript
    gulp.task('scripts', ['scripts:validate'], function() {
      return gulp.src('./js/index.js')
        .pipe(browserified)

        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))

        .pipe(gulp.dest(path.join(distPath, 'js')));
    });
     
    // Clean
    gulp.task('clean', function(cb) {
        del([path.join(distPath, 'js'), path.join(distPath, 'styles')], cb);
    });
     
    // Default task
    gulp.task('default', ['clean'], function() {
        gulp.start('styles', 'scripts');
    });
     
    // Watch
    gulp.task('watch', function() {
      gulp.watch('less/**/*.less', ['styles']);
      gulp.watch('js/**/*.js', ['scripts']);
    });
}(require));