(function(require){
    'use strict';

    var project = require('./package.json'),
        path = require('path'),
        outputPath = path.join(__dirname, 'dist', project.name),
        distWebPath = path.join(outputPath, 'web', project.name),
        production = process.env.NODE_ENV === 'production';

    // Load plugins
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        buffer = require('gulp-buffer'),
        transform = require('vinyl-transform'),
        source = require('vinyl-source-stream'),
        fs = require('fs'),
        stream = require('stream'),
        mustache = require('mustache'),
        gulpstache = require("gulp-mustache"),
        less = require('gulp-less'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        del = require('del'),

        eslint = require('gulp-eslint'),
        jscs = require('gulp-jscs'),

        karma = require('karma').server,
        notifier = require('node-notifier'),

        browserify = require('browserify'),
        babelify = require('babelify'),
        debowerify = require('debowerify'),
        sourcemaps = require('gulp-sourcemaps');
    var runSequence = require('run-sequence');
    var replace = require('gulp-replace');

    // Optimisers
    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var uglify = require('gulp-uglify');
    var minifyHtml = require('gulp-minify-html');
    var minifyCss = require('gulp-minify-css');
    var rev = require('gulp-rev');
    var revReplace = require('gulp-rev-replace');

    var browserified = transform(function(filename) {
      var b = browserify({entries: filename, debug: true});
      return b.bundle();
    });

    function mustachifyWebParts(webParts, templatePath){
      var webParts = project.webParts || [],
          template = fs.readFileSync(templatePath, {encoding: 'utf8'}),
          src = stream.Readable({ objectMode: true });

      src._read = function () {
        mustache.parse(template); // speeds up mustache templating
        webParts.forEach(function(webPart) {
          var templatedOutput = mustache.render(template, {htmlFilePrefix: webPart.htmlFilePrefix});
          this.push(new gutil.File({ cwd: __dirname, base: path.join(__dirname, './webParts/'), path: path.join(__dirname, './webParts/', webPart.name + '.webpart.xml'), contents: new Buffer(templatedOutput) }))
          this.push(null)
        }, this)
      }
      return src
    };


    // Module definition XML for LabKey
    gulp.task('labkey:module', function() {
      return gulp.src("./templates/module.xml.mustache")
        .pipe(gulpstache({
            name: project.name,
            // LabKey needs double values for the version, so can't cope with SemVer.
            // We'll take the major and minor numbers to make the LabKey version.
            version: project.version.split(".").slice(0,2).join('.')
        }))
        .pipe(rename('module.xml'))
        .pipe(gulp.dest(path.join(outputPath, 'config')));
    });

    // Generates the XML definitions for each WebPart
    gulp.task('labkey:webParts', function() {
      return mustachifyWebParts(project.webParts, "./templates/webpart.xml.mustache")
        .pipe(gulp.dest(path.join(outputPath, 'views')));
    });

    gulp.task('views', ['labkey:webParts'], function() {
      return gulp.src("./views/**/*.html")
        .pipe(replace('/labking/', '<%=contextPath%>/labking/'))
        .pipe(gulp.dest(path.join(outputPath, 'views')));
    });

    // Styles
    gulp.task('styles', function() {
      return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(path.join(distWebPath, 'styles')));
    });

    // Fonts
    gulp.task('fonts', function() {
      return gulp.src('./bower_components/fontawesome/fonts/*')
        .pipe(gulp.dest(path.join(distWebPath, 'fonts')));
    });

    gulp.task('scripts:test', function (done) {
      karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        // 'osx' reporter hangs this test
        reporters: ['progress']
      }, done);
    });

    // Validate JavaScript
    gulp.task('scripts:validate', function() {
      return gulp.src(['./js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
    });


    // Build JavaScript with Browserify to index.js
    gulp.task('scripts:compile', function() {
      return browserify('./js/labking.module.js', {
            standalone: 'noscope',
            debug: true
          })
        .bundle()
        .pipe(source('application.js'))
        .pipe(buffer())
        .pipe(gulp.dest(path.join(distWebPath, 'js')))
    });

    gulp.task('useref', [
          'styles',
          'scripts:compile'
        ], function() {

      var userefAssets = useref.assets({
        searchPath: 'dist/labking/web'
      });

      var pipeline = gulp.src("views/**/*.html")
        .pipe(userefAssets)      // Concatenate with gulp-useref

        .pipe(gulpif('*.js', uglify({mangle: true})))
        .pipe(gulpif('*.css', minifyCss()))

        .pipe(rev())                // Rename the concatenated files
        .pipe(userefAssets.restore())
        .pipe(useref())
        .pipe(revReplace())         // Substitute in new filenames
        .pipe(replace('../web/', '<%=contextPath%>/'))
        .pipe(gulp.dest(path.join(outputPath, 'views')));
    });

    // Clean
    gulp.task('clean', function(cb) {
      del(['dist/**'], cb);
    });

    gulp.task('build:develop', function() {
      gulp.start(
        'fonts',
        'labkey:module',
        'styles',
        'scripts:compile',
        'scripts:validate',
        'views'
      );
    });

    gulp.task('build:optimised', function() {
      gulp.start(
        'fonts',
        'labkey:module',
        'scripts:validate',
        'useref'
      );
    });

    // Default task
    gulp.task('default', function (cb) {
      runSequence(
          'scripts:test',
          'build:optimised',
          cb
      );
    });

}(require));
