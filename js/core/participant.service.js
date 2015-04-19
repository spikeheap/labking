'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

function ParticipantService($q, logger) {
  var self = this;

  // Caching the queries reduces server load
  // and makes the UI more responsive
  var resultsCache = {
    participants: {}
  };

  return {
    getParticipantRecord: getParticipantRecord,
    getParticipantList: getParticipantList
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
      resultsCache.participantList = response.rows;
    }
  }


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
        dataSets[response.queryName] = response.rows[0];
      });

      resultsCache.participants[participantId] = { dataSets: dataSets };
    }
  }

  function fail(error) {
    var msg = 'query failed. ' + error.data.description;
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = ParticipantService;
