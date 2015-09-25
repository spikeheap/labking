'use strict';

/** @ngInject **/
function CohortService($q, logger, LabKey) {

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


  function getCohorts(useCache=true) {

    function updateCohortCache(response){
      resultsCache.cohorts = response.rows;
    }

    var getFromCacheIfPossible;
    if(resultsCache.cohorts && useCache){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKey.getCohorts())
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
