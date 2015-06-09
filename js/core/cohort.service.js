'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI');

function CohortService($q, logger) {

  function fail(error) {
    var msg = 'query failed. ';
    if(error.data !== undefined){
      msg = msg + error.data.description;
    }
    logger.error(msg);
    return $q.reject(msg);
  }

  // Caching the queries reduces server load
  // and makes the UI more responsive
  var resultsCache = {
    participants: {}
  };


  function getCohorts() {

    function updateCohortCache(response){
      resultsCache.cohorts = response.rows;
    }

    var getFromCacheIfPossible;
    if(resultsCache.cohorts){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getCohorts())
        .then(updateCohortCache);
    }

    return getFromCacheIfPossible
      .then(function(){
          return resultsCache.cohorts;
        })
      .catch(fail);
  }

  return {
    getCohorts: getCohorts
  };
}

module.exports = CohortService;
