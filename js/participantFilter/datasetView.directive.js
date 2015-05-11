'use strict';

var _ = require('lodash');
module.exports = DatasetView;

function DatasetView(ParticipantService, DatasetMetadataService) {
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

      scope.isFormShown = isFormShown;
      function isFormShown() {
        return !(scope.dataset && scope.dataset.DemographicData &&
                scope.participant && scope.participant.dataSets[scope.dataset.Name].length);
      }

      scope.getValue = getValue;
      function getValue(row, column){
        if (column.LookupQuery && scope.lookups[column.LookupQuery]) {
          var val = _.find(scope.lookups[column.LookupQuery].rows, 'Key', row[column.Name]);
          return val === undefined ? '' : val.Label;
        }else if (column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime'){
          return getValueAsDate(row[column.Name]);
        }else{
          return row[column.Name];
        }
      }

      scope.getValueAsDate = getValueAsDate;
      function getValueAsDate(value) {
        return new Date(value).toLocaleDateString('en-GB');
      }

      scope.createEntry = function(record) {
        record.ParticipantId = scope.participant.ParticipantId;

        ParticipantService.createRecord(scope.dataset.Name, record).then(function() {
          scope.reset();
        });
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
