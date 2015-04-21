'use strict';

require('../core/core.module');
require('../blocks/logger/logger.module');

require('angular-utils-pagination');

require('angular')
  .module('labking.participantFilter', ['blocks.logger', 'labking.core', 'angularUtils.directives.dirPagination'])
  .directive('participantFilter', require('./participantFilter.directive'))
  .directive('participantRecord', require('./participantRecord.directive'))
  ;
