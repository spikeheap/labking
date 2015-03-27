(function () {
  "use strict";

  var Marty = require("marty");

  var CohortFilterConstants = require("../constants/CohortFilterConstants");

  class CohortFilterStore extends Marty.Store {
    constructor(options) {
      super(options);
      // this.state = {
      //   cohortFilter: {}
      // };

      this.handlers = {
        addCohortToFilter: CohortFilterConstants.COHORT_ADD,
        removeCohort: CohortFilterConstants.COHORT_REMOVE
      };
    }

    addCohort(cohort) {
      this.state.cohorts.push(cohort);
      this.hasChanged();
    }

    addCohortToFilter(cohort) {
      this.state.cohortFilter[cohort.rowid] = cohort;
      this.hasChanged();
    }

    removeCohort(cohort) {
      delete this.state.cohortFilter[cohort.rowid];
      this.hasChanged();
    }

    getCohortFilter() {
      return this.state.cohortFilter || this.getCohorts();
    }

    getCohorts(){
      var that = this;
      return this.fetch('allCohorts',
        function(){ return this.state.cohorts },
        function(){ return getCohorts().then(function(data) { 
            console.log("Whoop, promise resolved");
            that.state.cohorts = [];
            that.state.cohortFilter = {};
            data.rows.forEach(function(cohort) {
              that.addCohort(cohort);
              that.addCohortToFilter(cohort)
            });
            that.hasChanged();
          }, function(error) {
            console.log("Sad times");
          });
        });
    }
  }

  function getCohorts(){
    return labkeyQuery("study", "Cohort");
  }

  function labkeySafeRequest(callback){
    LABKEY.requiresExt3ClientAPI(true, function() {
      Ext.onReady(callback);
    });
  }

  function labkeyQuery(schemaName, queryName){
    return new Promise(function(resolve, reject) {
      labkeySafeRequest(function() {
        LABKEY.Query.selectRows({ schemaName: "study", queryName: "Cohort", success: resolve, failure: reject
        });
      });
    });
  }

  module.exports = Marty.register(CohortFilterStore);

}());
