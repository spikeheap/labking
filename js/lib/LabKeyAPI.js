'use strict';
(function(LABKEY){

  var _ = require('lodash');
  let coerceFields = true;

  // // Wraps queries to ensure the LabKey Ext libraries are present and loaded.
  // function getLabkeyQueries(schemaName){
  //   return new Promise(function(resolve, reject) {
  //     LABKEY.requiresExt4ClientAPI(true, function() {
  //       LABKEY.Query.getQueries({
  //         schemaName: schemaName,
  //         success: resolve,
  //         failure: reject
  //       });
  //     });
  //   });
  // }

  function labkeyQuery(schemaName, queryName, filterArray=[], columns=[]){
    return new Promise(function(resolve, reject) {
      LABKEY.requiresExt4ClientAPI(true, function() {
        LABKEY.Query.selectRows({
          schemaName: schemaName,
          queryName: queryName,
          filterArray: filterArray,
          columns: columns,
          success: resolve,
          failure: reject
        });
      });
    });
  }

  function labkeyInsertRow(schemaName, dataSetName, entry) {
    return new Promise(function(resolve, reject) {
      LABKEY.requiresExt4ClientAPI(true, function() {
        LABKEY.Query.insertRows({
          schemaName: schemaName,
          queryName: dataSetName,
          rows: [entry],
          success: resolve,
          failure: reject
        });
      });
    });
  }

  function labkeyUpdateRow(schemaName, dataSetName, entry) {
    return new Promise(function(resolve, reject) {
      LABKEY.requiresExt4ClientAPI(true, function() {
        LABKEY.Query.updateRows({
          schemaName: schemaName,
          queryName: dataSetName,
          rows: [entry],
          success: resolve,
          failure: reject
        });
      });
    });
  }

  function labkeyDeleteRow(schemaName, dataSetName, entry){
    return new Promise(function(resolve, reject) {
      LABKEY.requiresExt4ClientAPI(true, function() {
        LABKEY.Query.deleteRows({
          schemaName: schemaName,
          queryName: dataSetName,
          rows: [entry],
          success: resolve,
          failure: reject
        });
      });
    });
  }

  function createLabKeyFilter(field, value){
    return LABKEY.Filter.create(field, value);
  }

  /**
   * API calls, all returning promises
   **/

  function getParticipants(columns=[]){
    return labkeyQuery('study', 'Participant', [], columns);
  }

  function getDataSet(dataSetId){
    return labkeyQuery('study', dataSetId)
      .then(processResponseTypes);
  }

  function getParticipantDataSet(subjectNoun, subjectId, dataSetId){
    return labkeyQuery('study', dataSetId, [createLabKeyFilter(subjectNoun, subjectId)])
      .then(processResponseTypes);
  }

  function getCohorts(){
    return labkeyQuery('study', 'Cohort');
  }

  // A participant cateogory contains many participant groups.
  // A participant may only belong to one group within each category
  function getParticipantCategories(){
    return labkeyQuery('study', 'ParticipantCategory');
  }

  function getParticipantGroups(){
    return labkeyQuery('study', 'ParticipantGroup');
  }

  // This contains the relationships between participants and participant groups
  function getParticipantGroupMaps(){
    return labkeyQuery('study', 'ParticipantGroupMap');
  }

  function getDataSets(){
    return labkeyQuery('study', 'DataSets', [], ['CategoryId/Label', 'CategoryId', 'DataSetId', 'DemographicData', 'QuerySnapshot', 'DisplayOrder', 'Label', 'Name', 'ProtocolId', 'ShowByDefault', 'Type', 'cohortid']);
  }

  // Returns all column names for all datasets.
  // You can restrict to
  function getDataSetsColumns(){
    return labkeyQuery('study', 'DataSetColumns');
  }

  // Get the columns for a single dataset. This takes the `Name` attribute
  // (not to be confused with `Label`)
  function getDataSetColumns(dataSetName){
    return labkeyQuery('study', 'DataSetColumns', [LABKEY.Filter.create('DataSet/Name', dataSetName)]);
  }

  function addDataSetRow(dataSetName, entry){
    return labkeyInsertRow('study', dataSetName, entry);
  }

  function updateDataSetRow(dataSetName, entry){
    return labkeyUpdateRow('study', dataSetName, entry);
  }

  function removeDataSetRow(dataSetName, entry){
    return labkeyDeleteRow('study', dataSetName, entry);
  }

  // Get all the available lookups (valid select-items)
  function getLookups(listName) {
    return labkeyQuery('lists', listName);
  }

  /* Internal utilities */
  function processResponseTypes(response){
    if(coerceFields){
      response.rows = response.rows.map(function (row) {
        return coerceToType(row, response.metaData.fields);
      });
    }
    return response;
  }

  function coerceToType (dataFields, metadata, idKey='fieldKey') {
    let coercedFields = {};
    _.forEach(dataFields, function (value, key) {
      let recordMetadata = _.find(metadata, idKey, key);

      if(recordMetadata === null || recordMetadata === undefined || value === null || value === undefined){
        switch(key){
          case 'date':
            coercedFields[key] = new Date(value);
            break;
          default:
            coercedFields[key] = value;
            break;
        }
      }
      else{
        switch(recordMetadata.type){
          case 'date':
            coercedFields[key] = new Date(value);
            break;
          default:
            coercedFields[key] = value;
            break;
        }
      }
    });
    return coercedFields;
  }

  module.exports = {
    getParticipants: getParticipants,
    getCohorts: getCohorts,
    getParticipantCategories: getParticipantCategories,
    getParticipantGroups: getParticipantGroups,
    getParticipantGroupMaps: getParticipantGroupMaps,
    getDataSets: getDataSets,
    getDataSetColumns: getDataSetColumns,
    getDataSetsColumns: getDataSetsColumns,
    getDataSet: getDataSet,
    getParticipantDataSet: getParticipantDataSet,
    getLookups: getLookups,
    insertRow: addDataSetRow,
    updateDataSetRow: updateDataSetRow,
    removeDataSetRow: removeDataSetRow,
    coerceToType: coerceToType
  };
})(window.LABKEY);
