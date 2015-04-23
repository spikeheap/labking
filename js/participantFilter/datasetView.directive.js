'use strict';

var _ = require('lodash');
module.exports = DatasetView;

function DatasetView(ParticipantService, DatasetMetadataService, $window) {
  return {
    scope: {
      participant: '=',
      dataset: '='
    },
    templateUrl: '../../labking/js/participantFilter/datasetView.directive.html',

    link: function (scope) {
      scope.lookups = {};
      DatasetMetadataService.getLookups().then(function(lookupSet) {
        scope.lookups = lookupSet;
      });

      scope.isFormShown = isFormShown
      function isFormShown() {
        return !(scope.dataset && scope.dataset.DemographicData && 
                scope.participant && scope.participant.dataSets[scope.dataset.Name].length)
      }

      scope.getValue = getValue;
      function getValue(row, column){
        if (column.LookupQuery && scope.lookups[column.LookupQuery]) {
          return _.find(scope.lookups[column.LookupQuery].rows, 'Key', row[column.Name]).Label
        }else if (column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime'){
          return new Date(row[column.Name]).toLocaleDateString('en-GB');
        }else{
          return row[column.Name]
        }
      }

      scope.createEntry = function(entry) {
        var record = angular.copy(entry);
        record.ParticipantId = scope.participant.ParticipantId;

        ParticipantService.createRecord(scope.dataset.Name, record).then(function() {
          scope.reset();
        })

      };

      scope.reset = function(form) {
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }else{
          scope.reset(scope.form);
        }
        scope.entry = {};
      };

      var _skipWatch = false;
      // Watch the dataset and clear the form on change
      scope.$watch('dataset', function(after, before) {
        scope.reset();
      });

      // Watch the participant and clear the form on change
      scope.$watch('participant', function() {
        scope.reset();
      });
    }
  };
}
