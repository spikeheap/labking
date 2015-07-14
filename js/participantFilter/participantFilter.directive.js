'use strict';

module.exports = ParticipantFilter;

/** @ngInject **/
function ParticipantFilter() {
  return {
    scope: {
      onParticipantSelect: '&'
    },
    template: require('./participantFilter.directive.html'),
    controllerAs: 'vm',
    bindToController: true,
    controller: require('./participantFilter.controller')
  };
}

