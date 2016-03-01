'use strict';

exports.name = 'ParticipantGroupsService';
exports.service = ParticipantGroupsService;


/** @ngInject **/
function ParticipantGroupsService($q, logger, config) {
  var LabKeyAPI = require('../lib/LabKeyAPI'),
    _ = require('lodash');

  var ParticipantGroup = require('../model/participantGroup.model');
  var ParticipantGroupCategory = require('../model/participantGroupCategory.model');

  var participantGroupCategories = {};
  var participantGroups = {};

  return {
    getParticipantGroups: getParticipantGroups,
    getParticipantGroupCategories: getParticipantGroupCategories
  };


  /**
   * Public API
   **/

  function getParticipantGroups(useCache=true) {
    var listFromCacheOrServer;
    if(_.keys(participantGroups).length > 0 && useCache){
      listFromCacheOrServer = $q.when();
    }else{
      listFromCacheOrServer = $q.when(LabKeyAPI.getParticipantGroupMaps())
        .then(updateParticipantGroupsCache);
    }

    return listFromCacheOrServer
      .then(function(){ return participantGroups; })
      .catch(fail);
  }

  function getParticipantGroupCategories(useCache=true) {
    var listFromCacheOrServer;
    if(_.keys(participantGroups).length > 0 && useCache){
      listFromCacheOrServer = $q.when();
    }else{
      listFromCacheOrServer = $q.when(LabKeyAPI.getParticipantGroupMaps())
        .then(updateParticipantGroupsCache);
    }

    return listFromCacheOrServer
      .then(function(){ return _.groupBy(participantGroups, function(group){ return group.category.label; }); })
      .catch(fail);
  }

  /**
   * Private functions
   **/

  function updateParticipantGroupsCache(response){
    response.rows.forEach(function (participantGroupMapping) {
      var categoryId = participantGroupMapping['GroupId/CategoryId'];
      var categoryLabel = participantGroupMapping['GroupId/CategoryId/Label'];
      var groupId = participantGroupMapping.GroupId;
      var groupLabel = participantGroupMapping['GroupId/Label'];
      var participantId = participantGroupMapping[config.subjectNoun];

      // Create participant group category if it doesn't exist
      if(participantGroupCategories[categoryId] === undefined){
        participantGroupCategories[categoryId] = new ParticipantGroupCategory(categoryId, categoryLabel);
      }

      // Create participant group if it doesn't exist
      if(participantGroups[groupId] === undefined){
        participantGroups[groupId] = new ParticipantGroup(groupId, groupLabel, participantGroupCategories[categoryId]);
      }

      // Add the participant
      participantGroups[groupId].addParticipant(participantId);
    });
  }

  function fail(error) {
    var msg = 'query failed. ';
    if(error.data !== undefined){
      msg = msg + error.data.description;
    }
    logger.error(msg);
    return $q.reject(msg);
  }
}
