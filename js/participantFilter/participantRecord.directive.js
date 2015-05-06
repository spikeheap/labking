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
            return scope.participant.dataSets.Database_Enrollment[0];
          }else{
            return {};
          }
        };

        scope.getParticipantName = function() {
          return `${scope.getEnrolmentDataSet().FirstName} ${scope.getEnrolmentDataSet().LastName}`;
        };

        scope.selectCategory = function(category) {
          scope.selectedCategory = category;
          scope.selectDataSet(scope.selectedCategory[0]);
        };

        scope.selectDataSet = function(dataSet) {
          scope.selectedDataSet = dataSet;
        };

        activate();

        function activate() {
          scope.selectedCategory = {};
          scope.selectedDataSet = {};

          DatasetMetadataService.getMetaData().then(function(metadata) {

            scope.metadata = _.sortBy(metadata, 'DisplayOrder')
              .filter(function(dataSet) { return dataSet.ShowByDefault; });
            scope.categories = _.groupBy(scope.metadata, function(dataset) {
              return dataset['CategoryId/Label'];
            });
            scope.selectCategory(scope.categories[_.keys(scope.categories)[0]]);
          });

          DatasetMetadataService.getLookups().then(function(lookups) {
            self.lookups = lookups;
          });
        }
      }
    };
  }
