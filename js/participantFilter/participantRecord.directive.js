'use strict';

var _ = require('lodash');
module.exports = ParticipantRecord;

function ParticipantRecord(ParticipantService, DatasetMetadataService) {
    return {
      scope: {
        participant: '='
      },
      templateUrl: '../../labking/js/participantFilter/participantRecord.directive.html',

      link: function (scope) {
        
        // Utility to get at demographic data for the headers
        scope.getEnrolmentDataSet = function() {
          if(scope.participant && scope.participant.dataSets){
            return scope.participant.dataSets['Database_Enrollment'];
          }else{
            return {};
          }
        };

        scope.getParticipantName = function() {
          return `${scope.getEnrolmentDataSet().FirstName} ${scope.getEnrolmentDataSet().LastName}`
        };

        activate();

        function activate() {;

          DatasetMetadataService.getMetaData().then(function(metadata) {
            scope.metadata = metadata;
            scope.categories = _.groupBy(scope.metadata, function(dataset) {
              return dataset.CategoryId;
            })
          });

          DatasetMetadataService.getLookups().then(function(lookups) {
            self.lookups = lookups;
          });


        };
      }
    };
  }
