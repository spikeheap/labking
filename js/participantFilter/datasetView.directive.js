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
    controller: function($filter) {
      var self = this;

      self.getValue = getValue;

      function getValue(row, column){
        // if (column.LookupQuery && self.lookups[column.LookupQuery]) {
        //   var val = _.find(self.lookups[column.LookupQuery].rows, 'Key', row[column.Name]);
        //   return val === undefined ? '' : val.Label;
        // }else

        if (column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime'){
          return $filter('date')(row[column.Name], 'shortDate');
        }else{
          return row[column.Name];
        }
      }
    }
  };
}
