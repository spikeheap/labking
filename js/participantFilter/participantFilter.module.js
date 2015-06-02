'use strict';

require('../core/core.module');
require('../blocks/logger/logger.module');

require('angular-utils-pagination');
require('angular-bootstrap');
require('ui.grid');
require('ui.utils');

require('angular')
  .module('labking.participantFilter', ['blocks.logger',
    'labking.core',
    'angularUtils.directives.dirPagination',
    'ui.indeterminate',
    'ui.bootstrap',
    'ui.grid'
  ])
  .directive('participantFilter', require('./participantFilter.directive'))
  .directive('participantRecord', require('./participantRecord.directive'))
  .directive('datasetView', require('./datasetView.directive'))
  .controller('DatasetEditModalController', require('./datasetEditModal.controller'))
  ;
