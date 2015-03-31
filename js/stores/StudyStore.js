(function () {
  "use strict";

  var _ = require("lodash"),
      Marty = require("marty"),
      when = require('marty/when');

  var StudyStoreConstants = require("../constants/StudyStoreConstants"),
      LabKeyAPI = require("../lib/LabKeyAPI");

  function logError(error) {
    console.log("Sad times");
  }

  class StudyStore extends Marty.Store {
    constructor(options) {
      super(options);
      this.state = {
        dataSets: []
      };
      this.handlers = {
        addCohortToFilter: StudyStoreConstants.COHORT_ADD,
        removeCohortFromFilter: StudyStoreConstants.COHORT_REMOVE
      };
    }

    

    getDataSets(){
      var self = this;
      return this.fetch('dataSets',
        // local
        function(){ 
          return this.state.dataSets;
        },
        // remote
        function(){ 
          return LabKeyAPI.getDataSets().then(
            function(data) { 
              console.log('success');
              console.log(data);
              self.state.dataSets = data.rows;
              self.hasChanged();
            }, function(error) {
              console.log("Sad times");
            });
        });
    }
  }

  module.exports = Marty.register(StudyStore);

}());
