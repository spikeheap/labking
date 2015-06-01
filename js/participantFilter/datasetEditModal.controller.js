'use strict';

module.exports = DatasetEditModalController;

/* @ngInject */
function DatasetEditModalController($modalInstance, isCreate, selectedDataset, lookups) {
  var self = this;

  self.editTypeLabel = isCreate ? 'Create' : 'Edit';
  self.dataset = selectedDataset;
  self.lookups = lookups;

  self.submit = function () {
    $modalInstance.close(self.entry);
  };

  self.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}
