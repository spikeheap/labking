'use strict';

//ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];

/* @ngInject */
function ParticipantEditorController($scope, $q, logger, DatasetMetadataService, ParticipantService, CohortService) {
  var self = this;
  
  // Pre-load the lookups
  DatasetMetadataService.getLookups();
  
  self.selectParticipant = function(participantId) {
    // Subsequent selects will overwrite the selected ID, so we can prevent catch-up rendering.
    self.selectedParticipantId = participantId;
    self.loadingParticipant = true;
    $q.when(ParticipantService.getParticipantRecord(participantId))
      .then(function(participant) {
        // Only update the UI if we've got the latest requested participant
        if(self.selectedParticipantId === participant.ParticipantId){
          self.loadingParticipant = false;
          self.currentParticipant = participant;
        }
      });
  };
}

module.exports = ParticipantEditorController;
