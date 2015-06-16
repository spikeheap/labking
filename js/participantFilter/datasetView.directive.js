'use strict';

module.exports = DatasetView;

/** @ngInject **/
function DatasetView() {
  return {
    scope: {
      participant: '=',
      dataset: '=',
      onEdit: '&'
    },
    template: require('./datasetView.directive.html'),

    controllerAs: 'vm',
    bindToController: true,
    /** @ngInject **/
    controller: function($filter, $scope, DatasetMetadataService) {
      var self = this;
      var _ = require('lodash');

      self.lookups = {};
      self.getValue = getValue;

      $scope.$watch(function () {
        return self.dataset;
      }, function (newVal) {
        if(newVal && self.dataset.columns){
          console.log("grabbing lookups");
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

      function getValue(row, column){
        if (column.LookupQuery && self.lookups[column.LookupQuery]) {
          var val = _.find(self.lookups[column.LookupQuery].rows, 'Key', row[column.Name]);
          return val === undefined ? '' : val.Label;
        }else if (column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime'){
          return $filter('date')(row[column.Name], 'shortDate');
        }else{
          return row[column.Name];
        }
      }
    }
  };
}
