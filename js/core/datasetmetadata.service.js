'use strict';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

/** @ngInject **/
function DatasetMetadataService($q, logger) {

  // We only need to do this request once, and it's quite heavy
  var resultsCache = {
    lookups: {},
  };

  return {
    getMetaData: getMetaData,
    getLookups: getLookups
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


  function getLookups(lookupName) {
    if(resultsCache.lookups[lookupName]){
      return $q.when(resultsCache.lookups[lookupName]);
    }

    return $q.when(LabKeyAPI.getLookups(lookupName))
      .then(updateLookupCache)
      .catch(fail);

    function updateLookupCache(lookups){
      resultsCache.lookups[lookupName] = lookups;
      return resultsCache.lookups[lookupName];
    }
  }

  function fail(error) {
    var msg = 'query failed. ';
    if(error.data !== undefined){
      msg = msg + error.data.description;
    }else{
      msg = msg + error;
    }
    logger.error(msg);
    return $q.reject(msg);
  }
}

module.exports = DatasetMetadataService;
