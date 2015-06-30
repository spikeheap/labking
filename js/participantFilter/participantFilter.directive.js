'use strict';
var _ = require('lodash');
module.exports = ParticipantFilter;

/** @ngInject **/
function ParticipantFilter($q, $modal, CohortService, ParticipantService) {
    return {
      scope: {
        onParticipantSelect: '&'
      },
      template: require('./participantFilter.directive.html'),

      controllerAs: 'vm',
      bindToController: true,
      controller: function () {
        var self = this;

        self.selectedCohorts = {};
        self.participantCount = participantCount;
        self.isCohortSelected = isCohortSelected;
        self.toggleCohort = toggleCohort;

        self.participantSearchText = '';
        self.clearSearch = clearSearch;
        self.participantSearchFilter = participantSearchFilter;

        self.allParticipants = [];
        self.selectedParticipant = {};
        self.selectParticipant = selectParticipant;
        self.isParticipantSelected = isParticipantSelected;
        self.keyFieldsPercentageComplete = keyFieldsPercentageComplete;

        self.openAddParticipantModal = openAddParticipantModal;

        activate();

        function activate(){
          $q.all([
            ParticipantService.getParticipantList(),
            ParticipantService.getParticipantKeyInfo()
          ]).then(function(responses) {
            var [participants, participantsKeyInfo] = responses;
            self.allParticipants = participants.map(function(participant) {
              participant.keyInfo = _.find(participantsKeyInfo, 'ParticipantId', participant.ParticipantId);
              return participant;
            });
            filterParticipants();
          });

          CohortService.getCohorts().then(function(cohorts) {
            self.cohorts = cohorts;
            self.cohorts.forEach(function(cohort) {
              self.selectedCohorts[cohort.rowid] = true;
            });
            filterParticipants();
          });
        }

        function selectParticipant(participant) {
          self.selectedParticipant = participant;
          self.onParticipantSelect({participantId: participant.ParticipantId});
        }

        function isParticipantSelected(participant){
          return participant && participant.ParticipantId && self.selectedParticipant.ParticipantId === participant.ParticipantId;
        }

        function filterParticipants(){
          self.filteredParticipants = self.allParticipants.filter(function(candidateParticipant) {
            return self.selectedCohorts[candidateParticipant.Cohort];
          });
        }

        function clearSearch(){
          self.participantSearchText = '';
        }

        function participantSearchFilter(participant) {
          var keyInfo = participant.keyInfo || {};
          return (
            fieldMatches(participant.ParticipantId, self.participantSearchText) ||
            fieldMatches(keyInfo.NHSNumber, self.participantSearchText) ||
            fieldMatches(keyInfo.MRNNumber, self.participantSearchText) ||
            fieldMatches(keyInfo.FirstName, self.participantSearchText) ||
            fieldMatches(keyInfo.LastName, self.participantSearchText)
          );
        }

        function fieldMatches(field, term){
          return field && field.toUpperCase().indexOf(term.toUpperCase()) > -1;
        }

        /**
         The cohort filter

         If a cohort is IN the filter this will remove the e
        **/

        function toggleCohort(cohort) {
          self.selectedCohorts[cohort.rowid] = !self.selectedCohorts[cohort.rowid];
          filterParticipants();
        }

        function isCohortSelected(cohort) {
          return self.selectedCohorts[cohort.rowid];
        }

        function participantCount(cohort){
          return self.allParticipants.filter(function(participant) {
            return participant.Cohort === cohort.rowid;
          }).length;
        }

        function keyFieldsPercentageComplete(participant){
          var userEditableFields = _.omit(participant.keyInfo, function(value, key){
            return key.startsWith('_') || key === 'date' || key === 'lsid ' || key === 'ParticipantId';
          });

          var completedFields = _.omit(userEditableFields, function(value){
            return value === null;
          });
          return (_.keys(completedFields).length / _.keys(userEditableFields).length) * 100;
        }

        function openAddParticipantModal() {
          $modal.open({
            animation: true,
            template: require('./datasetEditModal.html'),
            controller: 'DatasetEditModalController as vm',
            resolve: {
              participantId: function() {},
              entry: function () {},
              datasetName: function () {
                return 'Dataset_Enrollment';
              },
              onSave: function() {
                return ParticipantService.createRecord;
              }
            }
          });
        }
      }
    };
  }
