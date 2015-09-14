'use strict';

var moduleName = 'labking.participantGroups';

var participantGroupsService = require('./participantGroups.service');

require('angular')
  .module(moduleName, [])
  .service(participantGroupsService.name, participantGroupsService.service)
  .directive('participantGroupFilter', require('./participantGroupFilter.directive'))
  ;

module.exports = moduleName;
