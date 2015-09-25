'use strict';

const LABKEY_DATE_FORMAT = 'YYYY/MM/DD hh:mm:ss';

var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash'),
    moment = require('moment');

/** @ngInject **/
function ParticipantKeyInfoService(config, ParticipantService, $q, logger) {

  return {
    getParticipantKeyInfo: getParticipantKeyInfo,
    getKeyInfoColumns: getKeyInfoColumns
  };

  // private functions

  function getKeyInfoColumns() {

  }

  function getKeyInfo(participantId) {
    //
    return config.keyDemographicFields.map(function (fieldName) {
      // fieldName = 'dataset.fieldname'
      //
    });
  }

  function splitFieldPath (fieldName) {
    return fieldName.split('.');
  }

}

module.exports = ParticipantKeyInfoService;
