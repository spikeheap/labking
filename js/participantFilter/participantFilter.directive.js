'use strict';
var _ = require('lodash');
module.exports = ParticipantFilter;

function ParticipantFilter(CohortService, ParticipantService) {
    return {
      scope: {
        onParticipantSelect: '&'
      },
      templateUrl: '../../labking/js/participantFilter/participantFilter.directive.html',

      link: function (scope) {

        ParticipantService.getParticipantList().then(function(participants) {
          scope.allParticipants = participants;
          filterParticipants();
          scope.$apply();
        });

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

      }
    };
  }
