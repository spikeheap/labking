'use strict';

require('../core/core.module');
require('../blocks/logger/logger.module');

require('angular-utils-pagination');
require('ui.utils');

require('angular')
  .module('labking.participantFilter', ['blocks.logger', 'labking.core', 'angularUtils.directives.dirPagination', 'ui.indeterminate'])
  .directive('participantFilter', require('./participantFilter.directive'))
  .directive('participantRecord', require('./participantRecord.directive'))
  .directive('datasetView', require('./datasetView.directive'))
  ;
