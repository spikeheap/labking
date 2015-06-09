'use strict';

var angular = require('angular');

require('./core/core.module');
require('./layout/layout.module');
require('../tmp/templates');

angular
  .module('labking', [
    'labking.core',
    'labking.layout',
    'templates'
  ]);
