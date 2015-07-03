'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

/** @ngInject **/
function ParticipantService(DatasetMetadataService, $q, logger) {

  // Caching the queries reduces server load
  // and makes the UI more responsive
  var resultsCache = {
    participants: {},
    participantKeyInfo: {}
  };

  return {
    getParticipantKeyInfo: getParticipantKeyInfo,
    getParticipantRecord: getParticipantRecord,
    getParticipantList: getParticipantList,
    createRecord: createRecord,
    updateRecord: updateRecord,
    removeRecord: removeRecord
  };

  function getParticipantList() {
    var getFromCacheIfPossible;
    if(resultsCache.participantList){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getParticipants())
        .then(updateParticipantListCache);
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.participantList; })
      .catch(fail);

    function updateParticipantListCache(response){
      var deferred = $q.defer();
      resultsCache.participantList = response.rows;
      deferred.resolve();
      return deferred.promise;
    }
  }


  function getParticipantKeyInfo() {
    const KEY_INFO_DATASET_NAME = 'Database_Enrollment';
    var getFromCacheIfPossible;
    if(resultsCache[KEY_INFO_DATASET_NAME]){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getDataSet(KEY_INFO_DATASET_NAME))
        .then(updateParticipantKeyInfoCache);
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.participantKeyInfo; })
      .catch(fail);

    function updateParticipantKeyInfoCache(response){
      var deferred = $q.defer();
      response.rows.forEach(function(record) {
        resultsCache.participantKeyInfo[record.ParticipantId] = record;
      });
      deferred.resolve();
      return deferred.promise;
    }
  }


  function getParticipantRecord(participantId) {
    var getFromCacheIfPossible;
    if(resultsCache.participants[participantId]){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getDataSets())
        .then(getDataSetsForParticipant)
        .then(updateParticipantCache);
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.participants[participantId]; })
      .catch(fail);

    function getDataSetsForParticipant(response) {
        var participantDataSetPromises = response.rows.map((dataSet) => $q.when(LabKeyAPI.getParticipantDataSet(participantId, dataSet.Name)));
        return $q.all(participantDataSetPromises);
    }

    function updateParticipantCache(responsesArray){
      var dataSets = {};
      responsesArray.forEach((response) => {
        dataSets[response.queryName] = response;
      });

      resultsCache.participants[participantId] = { ParticipantId: participantId, dataSets: dataSets };
    }
  }

  function createRecord(dataSetName, record) {
    record = _.cloneDeep(record);
    if(record.date){
      record.date = record.date.toLocaleString();
    }

    return $q.all([DatasetMetadataService.getMetaData(), LabKeyAPI.insertRow(dataSetName, record)])
      .then(function(responses) {
        var [metadata, response] = responses;
        var participantId = response.rows[0].ParticipantId;

        if(resultsCache.participants[participantId] === undefined){
          resultsCache.participants[participantId] = {
            ParticipantId: participantId,
            dataSets: {}
          };
        }

        if(resultsCache.participants[participantId].dataSets[dataSetName] === undefined){
          resultsCache.participants[participantId].dataSets[dataSetName] = {
            rows: []
          };
        }

        var datasetMetadata = _.find(metadata, {Name: dataSetName}).columns;
        response.rows = response.rows.map(function(row) {
          return LabKeyAPI.coerceToType(row, datasetMetadata, 'Name');
        });

        Array.prototype.push.apply(resultsCache.participants[participantId].dataSets[dataSetName].rows, response.rows);

        logger.success('Record created');
        return $q.when();
      })
      .catch(function(errors){
        logger.error(errors.exception, 'Save failed');
        return $q.reject(errors);
      });
  }

  function updateRecord(dataSetName, record) {
    record = _.cloneDeep(record);
    record.date = record.date.toLocaleString();
    return $q.all([DatasetMetadataService.getMetaData(), LabKeyAPI.updateDataSetRow(dataSetName, record)])
      .then(function(responses) {
        var [metadata, response] = responses;
        var participantId = response.rows[0].ParticipantId;
        var dataset = resultsCache.participants[participantId].dataSets[dataSetName].rows;

        var datasetMetadata = _.find(metadata, {Name: dataSetName}).columns;
        response.rows = response.rows.map(function(row) {
          return LabKeyAPI.coerceToType(row, datasetMetadata, 'Name');
        });

        var i = _.findIndex(dataset, { 'lsid': record.lsid});
        dataset[i] = record;
        logger.success('Record updated');
        return $q.when();
      })
      .catch(function(errors){
        logger.error(errors.exception, 'Save failed');
        return $q.reject(errors);
      });
  }

  function removeRecord(dataSetName, record) {
    return $q.when(LabKeyAPI.removeDataSetRow(dataSetName, record))
      .then(function () {
        var dataset = resultsCache.participants[record.ParticipantId].dataSets[dataSetName].rows;
        var i = _.findIndex(dataset, { 'lsid': record.lsid});
        dataset.splice(i, 1);
      })
      .catch(function(errors){
        logger.error(errors.exception, 'Delete failed');
        return $q.reject(errors);
      });

  }

  function fail(error) {
    var msg = 'query failed. ';
    if(error.data !== undefined){
      msg = msg + error.data.description;
    }
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = ParticipantService;
