'use strict';

var angular = require('angular');

module.exports = DatasetView;

/* @ngInject */
function DatasetView(ParticipantService) {
  return {
    scope: {
      participant: '=',
      dataset: '='
    },
    templateUrl: '../../labking/js/participantFilter/datasetView.directive.html',

    /* @ngInject */
    link: function(scope) {

      scope.isFormShown = isFormShown;
      function isFormShown() {
        return !(scope.dataset && scope.dataset.DemographicData &&
                scope.participant && scope.participant.dataSets[scope.dataset.Name].length);
      }

      scope.createEntry = function(entry) {
        var record = angular.copy(entry);
        record.ParticipantId = scope.participant.ParticipantId;
        ParticipantService.createRecord(scope.dataset.Name, record).then(function() {
          scope.reset();
        });

      };

      scope.reset = function(form) {
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }else {
          scope.reset(scope.form);
        }
        scope.entry = {};
      };

      // Watch the dataset and clear the form on change
      scope.$watch('dataset', function() {
        scope.reset();
      });

      // Watch the participant and clear the form on change
      scope.$watch('participant', function() {
        scope.reset();
      });
    }
  };
}
