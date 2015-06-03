'use strict';

module.exports = DatasetEditModalController;

/**
 * Controller for the dataset editor Bootstrap modal.
 *
 * @param $modalInstance the associated modal.
 * @param entry the entry to edit, or undefined if a new entry is being created
 * @param selectedDataset the metadata for the entry.
 * @param lookups the options for `select` elements.
 * @ngInject
 **/
function DatasetEditModalController($modalInstance, entry, selectedDataset, lookups) {
  var self = this;

  self.editTypeLabel = 'Edit';
  self.entry = entry;
  self.dataset = selectedDataset;
  self.lookups = lookups;

  self.submit = submit;
  self.cancel = cancel;

  activate();


  function activate(){
    if(entry === undefined || entry === {}){
      self.editTypeLabel = 'Create';
      self.entry = {};
    }
  }

  function submit() {
    $modalInstance.close(self.entry);
  }

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
