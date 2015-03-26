(function(require){
    'use strict';

    var project = require('./package.json'),
        path = require('path'),
        distPath = path.join(__dirname, 'dist', project.name, 'web', project.name);

    // Load plugins
    var gulp = require('gulp'),
        less = require('gulp-less'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        babel = require('gulp-babel'),
        jshint = require('gulp-jshint'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        notify = require('gulp-notify'),
        del = require('del');
     
    // Styles
    gulp.task('styles', function() {
      return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.join(distPath, 'styles')))
        .pipe(notify({ message: 'Styles task complete' }));
    });
     
    // Scripts
    gulp.task('scripts', function() {
      return gulp.src('./js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.join(distPath, 'js')))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({sourceMap: true}))
        .pipe(gulp.dest(path.join(distPath, 'js')))
        .pipe(notify({ message: 'Scripts task complete' }));
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