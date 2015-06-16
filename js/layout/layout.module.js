'use strict';

require('../participantFilter/participantFilter.module');

require('angular')
  .module('labking.layout', ['labking.participantFilter']) // TODO add blocks require
  .directive('participantEditor', require('./participantEditor.directive'))
  ;
