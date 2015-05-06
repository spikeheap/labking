'use strict';

require('toastr.tpls');

require('angular')
  .module('blocks.logger', ['toastr'])
  .factory('logger', require('./logger'));
