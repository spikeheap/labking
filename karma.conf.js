// Karma configuration
// Generated on Sat Mar 28 2015 12:50:05 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({
     plugins: [
      'karma-browserify',
      'karma-mocha',
      'karma-chai',
      'karma-osx-reporter',
      'karma-phantomjs2-launcher'
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [

      // Test utilities
      // 'bower_components/angular-mocks/angular-mocks.js',
      // 'bower_components/bardjs/dist/bard.js',
      // 'bower_components/bardjs/dist/bard-ngRouteTester.js',
      // 'node_modules/bardjs/dist/bard.js',

      // Then our app for testing
      'js/labking.module.js',

      // Finally, the tests
      'js/**/*.spec.js',
    ],


    logLevel: 'LOG_DEBUG',

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    browserify: {
      watch: true,
      debug: true,
      transform: [
        'babelify',
        'debowerify',
        // ngAnnotate,
        // // 'brfs',
        // // 'bulkify'
      ],
      extensions: ['.js']
    },

    preprocessors: {
      'js/labking.module.js': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'osx'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS2'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
