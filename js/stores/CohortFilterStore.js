(function () {
  "use strict";

  var _ = require("lodash"),
      Marty = require("marty"),
      when = require('marty/when');

  var CohortFilterConstants = require("../constants/CohortFilterConstants"),
      LabKeyAPI = require("../lib/LabKeyAPI");

  class CohortFilterStore extends Marty.Store {
    constructor(options) {
      super(options);
      this.state = {
        cohortFilter: {}
      };
      this.handlers = {
        addCohortToFilter: CohortFilterConstants.COHORT_ADD,
        removeCohortFromFilter: CohortFilterConstants.COHORT_REMOVE
      };
    }

    addCohort(cohort) {
      this.state.cohorts.push(cohort);
      this.hasChanged();
    }

    /**
     * FILTER BY COHORT
     **/
    addCohortToFilter(cohort) {
      this.state.cohortFilter[cohort.rowid] = cohort;
      this.hasChanged();
    }

    removeCohortFromFilter(cohort) {
      delete this.state.cohortFilter[cohort.rowid];
      this.hasChanged();
    }

    getCohortFilter() {
      return this.state.cohortFilter || this.getCohorts();
    }

    /**
     * FILTER BY PARTICIPANT GROUP
     **/

    addParticipantGroupToFilter(cohort) {
      // TODO this.state.cohortFilter[cohort.rowid] = cohort;
      // TODO this.hasChanged();
    }

    removeParticipantGroupFromFilter(cohort) {
      // TODO delete this.state.cohortFilter[cohort.rowid];
      // TODO this.hasChanged();
    }

    getParticipantGroupFilter() {
      // TODO return this.state.cohortFilter || this.getCohorts();
    }






    getCohorts(){
      var that = this;
      return this.fetch('allCohorts',
        // local
        function(){ 
          return this.state.cohorts;
        },
        // remote
        function(){ 
          return LabKeyAPI.getCohorts().then(
            function(data) { 
              that.state.cohorts = [];
              that.state.cohortFilter = {};
              data.rows.forEach(function(cohort) {
                that.addCohort(cohort);
                that.addCohortToFilter(cohort)
              });
            }, 
            function(error) {
              console.log("Sad times");
            });
        });
    }

    getParticipantGroups(){
      var that = this;
      return this.fetch('allParticipantGroups',
        // local
        function(){ 
          return this.state.allParticipantGroups;
        },
        // remote
        function(){ 
          return LabKeyAPI.getParticipantGroups().then(
            function(data) { 
              that.state.allParticipantGroups = data.rows;
            }, 
            function(error) {
              console.log("Sad times");
            });
        });
    }


    getParticipants(){
      var that = this;
      return this.fetch('allParticipants',
        // local
        function(){ 
          return this.state.allParticipants;
        },
        // remote
        function(){ 
          return LabKeyAPI.getParticipants().then(
            function(data) { 
              that.state.allParticipants = data.rows;
              that.hasChanged();
            }, 
            function(error) {
              console.log("Sad times");
            });
        });
    }

    getFilteredParticipants(){
      var that = this;
      var participants = this.state.allParticipants || [];

      var included = participants.filter(function(candidateParticipant) {
        return _.any(that.state.cohortFilter, 'rowid', candidateParticipant.Cohort);
      });
      return included;
    }
  }

  module.exports = Marty.register(CohortFilterStore);

}());
