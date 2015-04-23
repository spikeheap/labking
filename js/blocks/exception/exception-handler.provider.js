// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run

'use strict';

/**
 * Must configure the exception handling
 * @return {[type]}
 */
function exceptionHandlerProvider() {
  /* jshint validthis:true */
  this.config = {
    appErrorPrefix: undefined
  };

  this.configure = function(appErrorPrefix) {
    this.config.appErrorPrefix = appErrorPrefix;
  };

  this.$get = function() {
    return {config: this.config};
  };
}

module.exports = exceptionHandlerProvider;
