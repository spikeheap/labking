'use strict';

var angular = require('angular');

require('./core/core.module');
require('./layout/layout.module');
require('../bower_components/angular-animate/index.js');

angular
  .module('labking', [
    'labking.core',
    'labking.layout',
    'ngAnimate'
  ]);
