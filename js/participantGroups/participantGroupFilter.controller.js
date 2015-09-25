'use strict';

module.exports = ParticipantGroupFilterController;

/** @ngInject **/
function ParticipantGroupFilterController(ParticipantService, ParticipantGroupsService, $q, $scope) {
  const _ = require('lodash');
  const NOT_IN_PREFIX = 'not_in_';
  let self = this;

  let selectedGroups = {};
  let ignoredCategories = {};

  self.toggleNotInCategory = toggleNotInCategory;
  self.isNotInCategorySelected = isNotInCategorySelected;

  self.isGroupSelected = isGroupSelected;
  self.participantCount = participantCount;
  self.toggleGroup = toggleGroup;

  self.selectAllGroups = selectAllGroups;
  self.excludeAllGroups = excludeAllGroups;
  self.toggleIgnoreCategory = toggleIgnoreCategory;
  self.isCategoryIgnored = isCategoryIgnored;

  activate().then(function () {
    // set initial state to selected
    _.each(self.categories, function (groups, categoryLabel) {
      selectAllGroups(categoryLabel);
      ignoredCategories[categoryLabel] = true;
    });
    emitChangeNotification();
  });




  // Refilter if we create or update a record
  // because the group may have changed
  $scope.$on('labkey:record:created', activate);
  $scope.$on('labkey:record:updated', activate);

  /**
   * Private methods
   */

  function activate () {
    return $q.all([
        ParticipantService.getParticipantList(),
        ParticipantGroupsService.getParticipantGroupCategories()
      ])
      .then(function (responses) {
        var [participants, participantGroupCategories] = responses;

        self.categories = participantGroupCategories;

        self.allParticipants = participants.map(function(participant) {
          return participant.ParticipantId;
        });

        emitChangeNotification();
      });
  }

  function isGroupSelected (group) {
    return group && selectedGroups[group.id];
  }

  function toggleGroup (group) {
    selectedGroups[group.id] = !selectedGroups[group.id];
    emitChangeNotification();
  }



  function selectAllGroups (categoryLabel) {
    filterByCategory(categoryLabel, false);
  }

  function excludeAllGroups (categoryLabel) {
    filterByCategory(categoryLabel, true);
  }

  function filterByCategory (categoryLabel, invert) {
    let groups = self.categories[categoryLabel];

    _.each(groups, function (group) {
      selectedGroups[group.id] = !invert;
    });
    selectedGroups[NOT_IN_PREFIX + categoryLabel] = invert;
    emitChangeNotification();
  }

  function toggleIgnoreCategory (categoryLabel) {
    ignoredCategories[categoryLabel] = !ignoredCategories[categoryLabel];
    emitChangeNotification();
  }

  function isCategoryIgnored (categoryLabel) {
    return ignoredCategories[categoryLabel];
  }


  function toggleNotInCategory (categoryLabel) {
    selectedGroups[NOT_IN_PREFIX + categoryLabel] = !selectedGroups[NOT_IN_PREFIX + categoryLabel];
    emitChangeNotification();
  }

  function isNotInCategorySelected (categoryLabel) {
    return selectedGroups[NOT_IN_PREFIX + categoryLabel];
  }


  function emitChangeNotification() {
    if (typeof self.onFilterChange === 'function') {
      self.onFilterChange({participantIDs: getSelectedParticipantIDs()});
    }
  }

  function getSelectedParticipantIDs () {

    var categoriesToFilter = _.filter(self.categories, function (groups, categoryLabel) {
      return !ignoredCategories[categoryLabel];
    });

    // If we have no groups the filter can't be applied, so return everything
    if(_.keys(categoriesToFilter).length === 0){
      return self.allParticipants;
    }

    var participantsInSelectedGroups = _.map(categoriesToFilter, function (groups) {
      return _.filter(groups, self.isGroupSelected).map(function (group) {
        return group.participantList;
      });
    });

    var categoriesSelected = _.filter(self.categories, function (groups, categoryLabel) {
      return !ignoredCategories[categoryLabel] && isNotInCategorySelected(categoryLabel);
    });

    var nonCategoryParticipants = _.uniq(_.flattenDeep(_.map(categoriesSelected, function (groups) {
      var excludeList = _.uniq(_.flattenDeep(groups.map(function (group) {
        return group.participantList;
      })));

      return _.filter(self.allParticipants, function (participant) {
        return !_.includes(excludeList, participant);
      });
    })));

    return _.uniq(_.flattenDeep(participantsInSelectedGroups.concat(nonCategoryParticipants)));
  }

  function participantCount (group) {
    return group.participantList ? group.participantList.length : 0;
  }
}

