'use strict';

//ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];

/* @ngInject */
function ShellController($scope, $q, logger, DatasetMetadataService, ParticipantService) {
  var _this = this;

  _this.selectParticipant = function(participantId) {
    _this.loadingParticipant = true;
    $q.when(ParticipantService.getParticipantRecord(participantId))
      .then(function(participant) {
        _this.loadingParticipant = false;
        _this.currentParticipant = participant;
      });
  };
}

module.exports = ShellController;
