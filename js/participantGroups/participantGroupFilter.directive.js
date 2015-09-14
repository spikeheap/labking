'use strict';

module.exports = ParticipantGroupFilter;

/** @ngInject **/
function ParticipantGroupFilter() {
  return {
    scope: {
      onFilterChange: '&'
    },
    template: require('./participantGroupFilter.directive.html'),
    controllerAs: 'vm',
    bindToController: true,
    controller: require('./participantGroupFilter.controller')
  };
}

