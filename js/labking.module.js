'use strict';

var angular = require('angular');

require('./core/core.module'),
require('./layout/layout.module')

angular
  .module('labking', [
    'labking.core',
    'labking.layout'
  ]);
