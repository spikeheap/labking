'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

/* @ngInject */
function CohortService($q, logger) {

  // Caching the queries reduces server load
  // and makes the UI more responsive
  var resultsCache = {
    participants: {}
  };

  return {
    getCohorts: getCohorts
  }

  function getCohorts() {
    var getFromCacheIfPossible;
    if(resultsCache.cohorts){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = LabKeyAPI.getCohorts()
        .then(updateCohortCache)
    }

    return getFromCacheIfPossible
      .then(function(){ 
          return resultsCache.cohorts; 
        })
      .catch(fail);


    function updateCohortCache(response){
      resultsCache.cohorts = response.rows;
    }
  }

  function fail(error) {
    var msg = 'query failed. ' + error.data.description;
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = CohortService;
