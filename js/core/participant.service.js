'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

function ParticipantService($q, logger) {
  var self = this;

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
    createRecord: createRecord
  }

  function getParticipantList() {
    var getFromCacheIfPossible;
    if(resultsCache.participantList){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = LabKeyAPI.getParticipants()
        .then(updateParticipantListCache)
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
      getFromCacheIfPossible = LabKeyAPI.getDataSet(KEY_INFO_DATASET_NAME)
        .then(updateParticipantKeyInfoCache)
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
  };


  function getParticipantRecord(participantId) {
    var getFromCacheIfPossible;
    if(resultsCache.participants[participantId]){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = LabKeyAPI.getDataSets()
        .then(getDataSetsForParticipant)
        .then(updateParticipantCache)
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.participants[participantId]; })
      .catch(fail);

    function getDataSetsForParticipant(response) {
        var participantDataSetPromises = response.rows.map((dataSet) => LabKeyAPI.getParticipantDataSet(participantId, dataSet.Name));
        return Promise.all(participantDataSetPromises);
    };

    function updateParticipantCache(responsesArray){
      var dataSets = {};
      responsesArray.forEach((response) => {
        dataSets[response.queryName] = response.rows;
      });

      resultsCache.participants[participantId] = { ParticipantId: participantId, dataSets: dataSets };
    }
  }

  function createRecord(dataSetName, record) {
    return $q.when(LabKeyAPI.insertRow('study', dataSetName, record))
      .then(function(response) {
        var participantId = response.rows[0].ParticipantId;
        Array.prototype.push.apply(resultsCache.participants[participantId].dataSets[dataSetName], response.rows);
        logger.success("Record saved");
        return $q.when();
      })
      .catch(function(errors){
        logger.error(errors.exception, "Save failed");
        return $q.reject(errors);
      });

  };

  function fail(error) {
    var msg = 'query failed. ' + error.data.description;
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = ParticipantService;
