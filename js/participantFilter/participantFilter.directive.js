'use strict';
var _ = require('lodash');
module.exports = ParticipantFilter;

function ParticipantFilter($q, CohortService, ParticipantService) {
    return {
      scope: {
        onParticipantSelect: '&'
      },
      templateUrl: '../../labking/js/participantFilter/participantFilter.directive.html',

      link: function (scope) {

        scope.allParticipants = [];
        $q.all([
          ParticipantService.getParticipantList(),
          ParticipantService.getParticipantKeyInfo()
        ]).then(function(responses) {
          var [participants, participantsKeyInfo] = responses;
          scope.allParticipants = participants.map(function(participant) {
            participant.keyInfo = _.find(participantsKeyInfo, 'ParticipantId', participant.ParticipantId);
            return participant
          });
          filterParticipants();
        })

        scope.selectedParticipant = {};
        scope.selectParticipant = function(participant, other) {
          scope.selectedParticipant = participant;
          scope.onParticipantSelect({participant: participant.ParticipantId});
        };

        scope.isParticipantSelected = function(participant){
          return participant, participant && participant.ParticipantId && scope.selectedParticipant.ParticipantId === participant.ParticipantId;
        };

        function filterParticipants(){
          scope.filteredParticipants = scope.allParticipants.filter(function(candidateParticipant) {
            return scope.selectedCohorts[candidateParticipant.Cohort];
          });
        }

        scope.participantSearchText = '';
        scope.participantSearchFilter = function(participant) {
          return (
            fieldMatches(participant.ParticipantId, scope.participantSearchText) ||
            fieldMatches(participant.keyInfo.NHSNumber, scope.participantSearchText) ||
            fieldMatches(participant.keyInfo.MRNNumber, scope.participantSearchText) ||
            fieldMatches(participant.keyInfo.FirstName, scope.participantSearchText) ||
            fieldMatches(participant.keyInfo.LastName, scope.participantSearchText)
          )
        };

        function fieldMatches(field, term){
          return field && field.toUpperCase().indexOf(scope.participantSearchText.toUpperCase()) > -1;
        }

        /**
         The cohort filter

         If a cohort is IN the filter this will remove the e
        **/

        scope.selectedCohorts = {};

        scope.toggleCohort = function(cohort) {
          scope.selectedCohorts[cohort.rowid] = !scope.selectedCohorts[cohort.rowid];
          filterParticipants();
        };
        scope.isCohortSelected = function(cohort) {
          return scope.selectedCohorts[cohort.rowid];
        };

        CohortService.getCohorts().then(function(cohorts) {
          scope.cohorts = cohorts;
          scope.cohorts.forEach(function(cohort) {
            scope.selectedCohorts[cohort.rowid] = true;
          });
          scope.$apply();
        });

        scope.participantCount = participantCount;
        function participantCount(cohort){
          return scope.allParticipants.filter(function(participant) {
            return participant.Cohort === cohort.rowid;
          }).length;
        }
      }
    };
  }
