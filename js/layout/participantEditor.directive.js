'use strict';

module.exports = ParticipantEditor;

/** @ngInject **/
function ParticipantEditor(config) {
  return {
    scope: {},
    template: require('./participantEditor.directive.html'),

    controllerAs: 'vmodel',
    bindToController: true,
    /** @ngInject **/
    controller: function($q, logger, DatasetMetadataService, ParticipantService) {
      var self = this;

      self.selectParticipant = function(participantId) {
        // Subsequent selects will overwrite the selected ID, so we can prevent catch-up rendering.
        self.selectedParticipantId = participantId;
        self.loadingParticipant = true;
        $q.when(ParticipantService.getParticipantRecord(participantId))
          .then(function(participant) {
            // Only update the UI if we've got the latest requested participant
            if(self.selectedParticipantId === participant[config.subjectNoun]){
              self.loadingParticipant = false;
              self.currentParticipant = participant;
            }
          });
      };
    }
  };
}
