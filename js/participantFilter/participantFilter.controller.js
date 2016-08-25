'use strict';

module.exports = ParticipantFilterController;

// @ngInject
function ParticipantFilterController($modal, $q, $scope, config, CohortService, ParticipantService, DatasetMetadataService) {
  var _ = require('lodash');
  var self = this;

  self.subjectNoun = config.subjectNoun;

  self.selectedCohorts = {
    null: true
  };
  self.participantCount = participantCount;
  self.isCohortSelected = isCohortSelected;
  self.toggleCohort = toggleCohort;
  self.selectAllCohorts = selectAllCohorts;
  self.selectNoCohorts = selectNoCohorts;

  self.participantSearchText = '';
  self.clearSearch = clearSearch;
  self.participantSearchFilter = participantSearchFilter;

  self.allParticipants = [];
  self.selectedParticipant = {};
  self.selectParticipant = selectParticipant;
  self.isParticipantSelected = isParticipantSelected;
  self.keyFieldsPercentageComplete = keyFieldsPercentageComplete;

  self.searchFields = config.searchFields.slice();
  self.openAddParticipantModal = openAddParticipantModal;

  self.updateParticipantGroupFilter = updateParticipantGroupFilter;

  activate();

  ///////

  $scope.$on('labkey:record:created', activate);
  $scope.$on('labkey:record:updated', activate);
  $scope.$on('labkey:record:removed', activate);

  //////

  function activate(){
    $q.all([
      ParticipantService.getParticipantList(false),
      ParticipantService.getParticipantKeyInfo(),
      CohortService.getCohorts(),
      DatasetMetadataService.getLookups('IgYears')
    ]).then(function(responses) {
      var [participants, participantsKeyInfo, cohorts, igYearsLookup] = responses;

      self.lookups = { IgYears: igYearsLookup};

      self.allParticipants = participants.map(function(participant) {
        participant.keyInfo = _.find(participantsKeyInfo, config.subjectNoun, participant[config.subjectNoun]);

        // We only have one lookup, so let's do that explicitly here
        participant.keyInfo.YearOfBirth = getValueFromLookup('IgYears', participant.keyInfo.YearOfBirth)

        return participant;
      });

      self.cohorts = cohorts;
      self.cohorts.forEach(function(cohort) {
        self.selectedCohorts[cohort.rowid] = true;
      });

      filterParticipants();
    });
  }

  function getValueFromLookup(lookupName, key) {
    // if the key is null, so is the value
    if(key === undefined){
      return undefined;
    }

    var lookup = _.find(self.lookups[lookupName].rows, 'Key', key);

    if(lookup !== undefined){
      return lookup.Label;
    }
  }

  function selectParticipant(participant) {
    self.selectedParticipant = participant;
    var subjectKey = config.subjectNoun;
    // lower-case the first character, because LabKey's expecting it that way
    subjectKey = subjectKey[0].toLowerCase() + subjectKey.substr(1);

    var payload = {};
    payload[subjectKey] = participant[config.subjectNoun];
    self.onParticipantSelect(payload);
  }

  function isParticipantSelected(participant){
    return participant && participant[config.subjectNoun] && self.selectedParticipant[config.subjectNoun] === participant[config.subjectNoun];
  }

  function filterParticipants(){
    self.filteredParticipants = self.allParticipants.filter(function(candidateParticipant) {
      return self.selectedCohorts[candidateParticipant.Cohort]
          && _.includes(self.groupFilterParticipantIDs, candidateParticipant.ParticipantId);
    });
  }

  function clearSearch(){
    self.participantSearchText = '';
  }

  function participantSearchFilter(participant) {
    var keyInfo = participant.keyInfo || {};
    var searchFields = config.searchFields || [];
    var match = false;

    searchFields.forEach(function (fieldName) {
      match = match || fieldMatches(keyInfo[fieldName], self.participantSearchText);
    });

    return match;
  }

  function fieldMatches(field, term){

    // We can't do much with undefined, so assume no match.
    if(field === undefined){
      return false;
    }

    return String(field).toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  /**
   The cohort filter

   If a cohort is IN the filter this will remove the e
  **/

  function toggleCohort(cohort) {
    self.selectedCohorts[cohort.rowid] = !self.selectedCohorts[cohort.rowid];
    filterParticipants();
  }

  function selectNoCohorts () {
    toggleAllCohorts(false);
  }

  function selectAllCohorts () {
    toggleAllCohorts(true);
  }

  function toggleAllCohorts(selected=true) {
    _.each(self.selectedCohorts, function (cohort, key) {
      if(key !== null){
        self.selectedCohorts[key] = selected;
      }
    });
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
      return key.startsWith('_') || key === 'date' || key === 'lsid ' || key === config.subjectNoun;
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
          return config.demographicDataset;
        },
        onSave: function() {
          return ParticipantService.createRecord;
        }
      }

    });
  }

  function updateParticipantGroupFilter (participantIDs) {
    self.groupFilterParticipantIDs = participantIDs;
    filterParticipants();
  }
}
