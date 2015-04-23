'use strict';

require('../participantFilter/participantFilter.module');

require('angular')
  .module('labking.layout', ['labking.participantFilter']) // TODO add blocks require
  .controller('ShellController', require('./shell.controller'))
  ;
