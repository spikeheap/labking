'use strict';

require('ui.router');
require('../logger/logger.module');

require('angular')
  .module('blocks.router', ['blocks.logger'])
  .provider('routerHelper', require('./router-helper.provider'));
