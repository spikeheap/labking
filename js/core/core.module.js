'use strict';

// TODO require blocks module
require('angular-ui-router');

require('../blocks/exception/exception.module');
require('../blocks/logger/logger.module');
require('../blocks/router/router.module');

var config = require('./config');

require('angular')
  .module('labking.core', [
      // 'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.logger', 'blocks.router',
      'ui.router'
      //, 'ngplus'
  ])
  //.constant('toastr', toastr)
  // .constant('moment', moment)
  .value('config', config.config)
  //.config(config.configure)
  //.config(config.toastrConfig)
;
