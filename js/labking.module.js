'use strict';

var angular = require('angular');

require('angular-animate');
require('../bower_components/angular-i18n/en-gb');

require('./core/core.module');
require('./layout/layout.module');

angular
  .module('labking', [
    'labking.core',
    'labking.layout',
    'labking.participantFilter',
    'ngAnimate'
  ]);
