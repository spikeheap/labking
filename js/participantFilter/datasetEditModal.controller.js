'use strict';

module.exports = DatasetEditModalController;

/**
 * Controller for the dataset editor Bootstrap modal.
 *
 * @param DatasetMetadataService the injected service to provide lookups.
 * @param $modalInstance the associated modal.
 * @param participantId the ID of the participant this record belongs to.
 * @param entry the entry to edit, or undefined if a new entry is being created.
 * @param selectedDataset the metadata for the entry.
 * @param lookups the options for `select` elements.
 * @param onSave the function to call when the form is submitted. This function must take the parameters `datasetName, record`.
 * @ngInject
 **/
function DatasetEditModalController($q, config, ParticipantService, DatasetMetadataService, $modalInstance, participantId, entry, datasetName, onSave) {
  var _ = require('lodash');
  var self = this;

  self.lookups = {};
  self.getLookup = getLookup;
  self.isNewSubject = participantId === undefined;
  self.columnType = columnType;
  self.isDisabled = isDisabled;
  self.isColumnShown = isColumnShown;
  self.editTypeLabel = 'Edit';
  self.entry = entry;
  self.onSave = onSave;
  self.fieldTypes = Object.freeze({INT: 0, DOUBLE: 1, BOOLEAN: 2, STRING: 3, MULTILINE: 4, LOOKUP: 5, DATETIME: 6});

  self.submit = submit;
  self.cancel = cancel;

  activate();


  function activate(){
    $q.all([DatasetMetadataService.getMetaData(), DatasetMetadataService.getColumnOrder(datasetName)]).then(function (responses) {
      var [metadata, columnModel] = responses;

      self.dataset = _.find(metadata, {Name: datasetName});
      self.dataset.columnModel = columnModel;

      _.filter(self.dataset.columns, function(column) {
          return !!column.LookupQuery;
        })
        .forEach(function (column) {
          var lookupQuery = column.LookupQuery;
          DatasetMetadataService.getLookups(lookupQuery)
            .then(function (lookup) {
              self.lookups[lookupQuery] = lookup;
            });
        });
    });

    if(self.isNewSubject) {
      ParticipantService.generateID()
        .then(function (newID) {
          self.entry[config.subjectNoun] = newID;
        });
    }

    if(entry === undefined || entry === {}){
      self.editTypeLabel = 'Create';
      self.entry = {};
      self.entry[config.subjectNoun] = participantId;
    }
  }

  function submit() {
    onSave(self.dataset.Name, self.entry).then($modalInstance.close);
  }

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function isDisabled(column) {
    // don't allow primary ID to be manipulated.
    return column.dataIndex === config.subjectNoun;
  }

  function isColumnShown(column) {

    var isShown = false;

    if(column.dataIndex === config.subjectNoun){
      isShown = self.isNewSubject;
    }else if(column.dataIndex === 'date'){
      isShown = !self.dataset.DemographicData;
    }else if(column && !column.hidden){
      isShown = true;
    }
    return isShown;
  }

  function columnType(columnName) {
    var column = _.find(self.dataset.columns, {Name: columnName});

    // Special cases where no metadata exists
    if(!column){
      if(columnName === 'date'){
        return self.fieldTypes.DATETIME;
      }else{
        return self.fieldTypes.STRING;
      }
    }

    var type;
    if(column.LookupQuery){
      return self.fieldTypes.LOOKUP;
    }else{
      switch(column.RangeURI) {
        case 'http://www.w3.org/2001/XMLSchema#int':
          type = self.fieldTypes.INT;
          break;
        case 'http://www.w3.org/2001/XMLSchema#double':
          type = self.fieldTypes.DOUBLE;
          break;
        case 'http://www.w3.org/2001/XMLSchema#boolean':
          type = self.fieldTypes.BOOLEAN;
          break;
        case 'http://www.w3.org/2001/XMLSchema#string':
          type = self.fieldTypes.STRING;
          break;
        case 'http://www.w3.org/2001/XMLSchema#dateTime':
          type = self.fieldTypes.DATETIME;
          break;
        case 'http://www.w3.org/2001/XMLSchema#multiLine':
          type = self.fieldTypes.MULTILINE;
          break;
        default:
          type = 'self.fieldTypes.STRING;';
      }
    }

    return type;
  }

  function getLookup(columnName) {
    var column = _.find(self.dataset.columns, {Name: columnName});
    return self.lookups[column.LookupQuery];
  }
}
