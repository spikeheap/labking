'use strict';

module.exports = DatasetView;

/** @ngInject **/
function DatasetView() {
  return {
    scope: {
      participant: '=',
      dataset: '=',
      onEdit: '&',
      onDelete: '&'
    },
    template: require('./datasetView.directive.html'),

    bindToController: true,
    controller: DatasetViewController,
    controllerAs: 'vm'
  };
}

/** @ngInject **/
function DatasetViewController($filter, $scope, config, DatasetMetadataService) {
  var self = this;
  var _ = require('lodash');

  self.lookups = {};
  self.getValue = getValue;
  self.showColumn = showColumn;
  self.showEditButton = showEditButton;

  $scope.$watch(function () {
    return self.dataset;
  }, function (newVal) {
    if(newVal && self.dataset.columns){
      self.dataset.columns
        .filter(function(column) {
          return !!column.LookupQuery;
        })
        .forEach(function (column) {
          var lookupQuery = column.LookupQuery;
          DatasetMetadataService.getLookups(lookupQuery)
            .then((lookup) => self.lookups[lookupQuery] = lookup);
        });
    }
  });

  function getValue(row, columnName){
    var column = _.find(self.dataset.columns, 'Name', columnName);
    if (column && column.LookupQuery && self.lookups[column.LookupQuery]) {
      var val = _.find(self.lookups[column.LookupQuery].rows, 'Key', row[column.Name]);
      return val === undefined ? '' : val.Label;
    }else if (isDate(row[columnName], column)){
      return $filter('date')(row[columnName], 'shortDate');
    }else{
      return row[columnName];
    }
  }

  function isDate (field, column) {
    if(column && column.RangeURI) {
      return column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime';
    }else {
      return field instanceof Date;
    }
  }

  /**
   * Angular filter for dataset views. Checks for hidden or default fields.
   *
   * Specifically, the ID of the record owner is not displayed, and the `Date` field
   * is hidden for demographic datasets.
   *
   * @param  {String} value the column to assess
   * @return {Boolean}      [description]
   */
  function showColumn(value) {
    if(value.hidden){
      return false; // no hidden fields
    }else if(value.dataIndex === 'date' && self.dataset.DemographicData){
      return false; // no date for demographic fields
    }else if(value.dataIndex === config.subjectNoun){
      return false; // no primary identifier
    }else{
      return true;
    }
  }

  function showEditButton(){
    return self.dataset.QuerySnapshot !== true;
  }
}
