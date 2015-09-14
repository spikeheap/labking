'use strict';

module.exports = ParticipantGroupFilter;

/** @ngInject **/
function ParticipantGroupFilter() {
  return {
    scope: {
      onParticipantSelect: '&'
    },
    template: require('./participantGroupFilter.directive.html'),
    controllerAs: 'vm',
    bindToController: true,
    controller: require('./participantGroupFilter.controller')
  };
}

