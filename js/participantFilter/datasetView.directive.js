'use strict';

var _ = require('lodash');
module.exports = DatasetView;

/** @ngInject **/
function DatasetView() {
  return {
    scope: {
      participant: '=',
      dataset: '=',
      onEdit: '&'
    },
    templateUrl: 'participantFilter/datasetView.directive.html',

    controllerAs: 'vm',
    bindToController: true,
    controller: function() {
      var self = this;

      self.lookups = {};
      self.getValueAsDate = getValueAsDate;
      self.getValue = getValue;

      function getValue(row, column){
        if (column.LookupQuery && self.lookups[column.LookupQuery]) {
          var val = _.find(self.lookups[column.LookupQuery].rows, 'Key', row[column.Name]);
          return val === undefined ? '' : val.Label;
        }else if (column.RangeURI === 'http://www.w3.org/2001/XMLSchema#dateTime'){
          return getValueAsDate(row[column.Name]);
        }else{
          return row[column.Name];
        }
      }

      function getValueAsDate(value) {
        return new Date(value).toLocaleDateString('en-GB');
      }
    }
  };
}
