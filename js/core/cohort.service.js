'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI');

/* @ngInject */
function CohortService($q, logger) {

  // Caching the queries reduces server load
  // and makes the UI more responsive
  var resultsCache = {
    participants: {}
  };

  return {
    getCohorts: getCohorts
  };

  function getCohorts() {
    var getFromCacheIfPossible;
    if (resultsCache.cohorts) {
      getFromCacheIfPossible = $q.when();
    }else {
      getFromCacheIfPossible = LabKeyAPI.getCohorts()
        .then(updateCohortCache);
    }

    return getFromCacheIfPossible
      .then(function() {
          return resultsCache.cohorts;
        })
      .catch(function(error) {
        var msg = 'query failed. ' + error.data.description;
        logger.error(msg);
        return $q.reject(msg);
      });

    function updateCohortCache(response) {
      resultsCache.cohorts = response.rows;
    }
  }
}

module.exports = CohortService;
