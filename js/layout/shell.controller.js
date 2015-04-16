'use strict';

//ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];

/* @ngInject */
function ShellController($scope, $q, logger, DatasetMetadataService, ParticipantService, CohortService) {
  var self = this;
  
  self.selectParticipant = function(participantId) {
    self.loadingParticipant=true;
    $q.when(ParticipantService.getParticipantRecord(participantId))
      .then(function(participant) {
        self.loadingParticipant=false;
        self.currentParticipant = participant;
      });
  };
}

module.exports = ShellController;
