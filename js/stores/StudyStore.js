(function () {
  "use strict";

  var _ = require("lodash"),
      Marty = require("marty"),
      when = require('marty/when');

  var StudyConstants = require("../constants/StudyConstants"),
      StudyQueries = require("../queries/StudyQueries"),
      LabKeyAPI = require("../lib/LabKeyAPI");

  class StudyStore extends Marty.Store {
    constructor(options) {
      super(options);
      this.state = {
        Study: {},
        participants: {},
        participantRecords: []
      };
      this.handlers = {
        addCohortToFilter: StudyConstants.COHORT_ADD,
        removeCohortFromFilter: StudyConstants.COHORT_REMOVE,
        updateParticipantRecord: StudyConstants.GET_PARTICIPANT,
        addParticipantRecord: StudyConstants.RECEIVE_PARTICIPANT
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
      this.state.Study[cohort.rowid] = cohort;
      this.hasChanged();
    }

    removeCohortFromFilter(cohort) {
      delete this.state.Study[cohort.rowid];
      this.hasChanged();
    }

    getStudy() {
      return this.state.Study || this.getCohorts();
    }

    /**
     * FILTER BY PARTICIPANT GROUP
     **/

    addParticipantGroupToFilter(cohort) {
      // TODO this.state.Study[cohort.rowid] = cohort;
      // TODO this.hasChanged();
    }

    removeParticipantGroupFromFilter(cohort) {
      // TODO delete this.state.Study[cohort.rowid];
      // TODO this.hasChanged();
    }

    getParticipantGroupFilter() {
      // TODO return this.state.Study || this.getCohorts();
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
              that.state.Study = {};
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
      var self = this;
      return this.fetch('allParticipantGroups',
        // local
        function(){ 
          return this.state.allParticipantGroups;
        },
        // remote
        function(){ 
          return LabKeyAPI.getParticipantGroups().then(
            function(data) { 
              self.setState({
                allParticipantGroups: data.rows
              });
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
        return _.any(that.state.Study, 'rowid', candidateParticipant.Cohort);
      });
      return included;
    }

    getParticipantDataSet(participantId, dataSetId){
      var self = this;
      return this.fetch('participant',
        // local
        function(){ 
          if(this.state.participants[participantId] === undefined){
            return undefined;
          }else{
            return this.state.participants[participantId][dataSetId];
          }
        },
        // remote
        function(){ 
          return LabKeyAPI.getParticipantDataSet(participantId, dataSetId).then(
            function(data) { 
              self.setState({
                participants: {
                  [participantId]: {
                    [dataSetId]: data.rows[0]
                  }
                }
              });
            }, 
            function(error) {
              console.log("Sad times");
            });
        });
    }

    /** 
     * Fetch a complete participant record, if needed,
     * including all data sets.
    **/
    updateParticipantRecord(participantId){
      var self = this;
      // TODO should we just do the call anyway?
      if(this.state.participantRecords[participantId] === undefined){
        StudyQueries.getParticipant(participantId);
      }
    }

    getParticipantRecords() {
      return this.state.participantRecords;
    }

    addParticipantRecord(participantId, participantRecord){
      this.state.participantRecords[participantId] = participantRecord;
      this.hasChanged();
    }

    /**
     * Fetch the Study metadata
     **/
    getDataSetMetaData(){
      var self = this;
      return this.fetch('dataSetMetaData',
        // local
        () => this.state.dataSetMetaData,
        // remote
        () => {
          return Promise.all([
                LabKeyAPI.getDataSets(), 
                LabKeyAPI.getDataSetsColumns()
              ])
            .then(responses => {
                var [dataSets, dataSetsColumns] = responses;

                var groupedColumns = _.groupBy(dataSetsColumns.rows, function(row) {
                  return row["DataSet/Name"];
                });

                var dataSetMetaData = dataSets.rows.map(function(dataSet) {
                  dataSet.columns = (groupedColumns[dataSet.Name] !== undefined) ? groupedColumns[dataSet.Name] : [];
                  return dataSet;
                });
                
                self.setState({
                  dataSetMetaData: dataSetMetaData
                });
              })
            .catch((error)
        });
    }
  }

  module.exports = Marty.register(StudyStore);

}());
