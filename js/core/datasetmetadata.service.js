'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

function DatasetMetadataService($q, logger) {

  // We only need to do this request once, and it's quite heavy
  var resultsCache = {};

  return {
    getMetaData: getMetaData,
    getLookups: getLookups,
    getCohortCategories: getCohortCategories
  };

  function getMetaData() {
    var getFromCacheIfPossible;
    if(resultsCache.metadata){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.all([
            LabKeyAPI.getDataSets(),
            LabKeyAPI.getDataSetsColumns()
          ])
        .then(updateMetaDataCache);
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.metadata; })
      .catch(fail);

    function updateMetaDataCache(responses){
      var [dataSets, dataSetsColumns] = responses;
      var groupedColumns = _.groupBy(dataSetsColumns.rows, function(row) {
        return row['DataSet/Name'];
      });

      resultsCache.metadata = dataSets.rows.map(function(dataSet) {
        dataSet.columns = (groupedColumns[dataSet.Name] !== undefined) ? groupedColumns[dataSet.Name] : [];
        return dataSet;
      });
    }
  }

  function getLookups() {
    var getFromCacheIfPossible;
    if(resultsCache.lookups){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getLookups()).then(updateLookupCache);
    }

    return getFromCacheIfPossible
      .then(function(){ return $q.when(resultsCache.lookups); })
      .catch(fail);

    function updateLookupCache(lookups){
      resultsCache.lookups = {};
      lookups.forEach(function(lookupResponse) {
        resultsCache.lookups[lookupResponse.queryName] = lookupResponse;
      });
    }
  }

  function getCohortCategories() {
    var getFromCacheIfPossible;
    if(resultsCache.cohortCategories){
      getFromCacheIfPossible = $q.when();
    }else{
      getFromCacheIfPossible = $q.when(LabKeyAPI.getLookups().then(updateCohortCategoriesCache));
    }

    return getFromCacheIfPossible
      .then(function(){ return resultsCache.cohortCategories; })
      .catch(fail);

    function updateCohortCategoriesCache(cohortCategories){
      resultsCache.cohortCategories = cohortCategories.map(function(response) {
        return response.rows;
      });
    }
  }

  function fail(error) {

    var msg = 'query failed. '
    if(error.data !== undefined){
      msg = msg + error.data.description;
    }
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = DatasetMetadataService;
