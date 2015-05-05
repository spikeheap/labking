'use strict';

require('ui.router');
require('../logger/logger.module');

require('angular')
  .module('blocks.exception', ['blocks.logger', 'ui.router'])
  .factory('exception', require('./exception'))
  .provider('exceptionHandler', require('./exception-handler.provider'))
  .config(require('./exception-handler.config'));
