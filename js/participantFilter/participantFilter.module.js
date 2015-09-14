'use strict';

require('../core/core.module');
require('../blocks/logger/logger.module');

require('angular-utils-pagination');
require('angular-bootstrap');

require('ui.utils');

require('angular')
  .module('labking.participantFilter', [
    'blocks.logger',
    'labking.core',
    require('../participantGroups/participantGroups.module'),
    'angularUtils.directives.dirPagination',
    'ui.indeterminate',
    'ui.bootstrap'
  ])
  .directive('participantFilter', require('./participantFilter.directive'))
  .directive('participantRecord', require('./participantRecord.directive'))
  .directive('datasetView', require('./datasetView.directive'))
  .controller('DatasetEditModalController', require('./datasetEditModal.controller'))
  ;
