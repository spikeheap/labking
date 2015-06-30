'use strict';

var _ = require('lodash');
module.exports = ParticipantRecord;

/** @ngInject **/
function ParticipantRecord(ParticipantService, DatasetMetadataService) {
    return {
      scope: {
        participant: '='
      },
      template: require('./participantRecord.directive.html'),
      controllerAs: 'vm',
      bindToController: true,
      /* @ngInject */
      controller: function($modal) {
        var self = this;

        self.selectedCategory = {};
        self.selectedDataSet = {};
        self.canAddEntries = canAddEntries;
        self.openEditModal = openEditModal;
        self.removeRecord = ParticipantService.removeRecord;
        self.getEnrolmentDataSet = getEnrolmentDataSet;
        self.getParticipantName = getParticipantName;
        self.selectCategory = selectCategory;
        self.selectDataSet = selectDataSet;

        DatasetMetadataService.getMetaData().then(function(metadata) {

          self.metadata = _.sortBy(metadata, 'DisplayOrder').filter(function(dataSet) { return dataSet.ShowByDefault; });
          self.categories = _.groupBy(self.metadata, function(dataset) {
            return dataset['CategoryId/Label'];
          });
          selectCategory(self.categories[_.keys(self.categories)[0]]);
        });



        // Utility to get at demographic data for the headers
        function getEnrolmentDataSet() {
          if(self.participant && self.participant.dataSets){
            return self.participant.dataSets.Database_Enrollment.rows[0];
          }else{
            return {};
          }
        }

        function getParticipantName() {
          return `${self.getEnrolmentDataSet().FirstName} ${self.getEnrolmentDataSet().LastName}`;
        }

        function selectCategory(category) {
          self.selectedCategory = category;
          selectDataSet(self.selectedCategory[0]);
        }

        function selectDataSet(dataSet) {
          self.selectedDataSet = dataSet;
        }

        function canAddEntries() {
          return !(self.selectedDataSet && self.selectedDataSet.DemographicData &&
                  self.participant && self.participant.dataSets[self.selectedDataSet.Name].rows.length);
        }

        function openEditModal(entry) {
          $modal.open({
            animation: true,
            template: require('./datasetEditModal.html'),
            controller: 'DatasetEditModalController as vm',
            resolve: {
              participantId: function() {
                return self.participant.ParticipantId;
              },
              entry: function() {
                // We clone the entry because if the action is cancelled we don't want the changes to persist.
                return _.cloneDeep(entry);
              },
              selectedDataset: function () {
                return self.selectedDataSet;
              },
              onSave: function() {
                return (entry === undefined) ? ParticipantService.createRecord : ParticipantService.updateRecord;
              }
            }
          });
        }
      }
    };
  }
