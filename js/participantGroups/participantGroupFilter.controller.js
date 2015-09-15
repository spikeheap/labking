'use strict';

module.exports = ParticipantGroupFilterController;

/** @ngInject **/
function ParticipantGroupFilterController(ParticipantService, ParticipantGroupsService, $q) {
  const _ = require('lodash');
  const NOT_IN_PREFIX = 'not_in_';
  let self = this;

  let selectedGroups = {};

  self.isCategorySelected = isCategorySelected;
  self.toggleCategory = toggleCategory;
  self.toggleNotInCategory = toggleNotInCategory;
  self.isNotInCategorySelected = isNotInCategorySelected;

  self.isGroupSelected = isGroupSelected;
  self.participantCount = participantCount;
  self.toggleGroup = toggleGroup;

  activate();

  /**
   * Private methods
   */

  function activate () {

    $q.all([
        ParticipantService.getParticipantList(false),
        ParticipantGroupsService.getParticipantGroupCategories()
      ])
      .then(function (responses) {
        var [participants, participantGroupCategories] = responses;

        self.categories = participantGroupCategories;

        self.allParticipants = participants.map(function(participant) {
          return participant.ParticipantId;
        });

        // set initial state to selected
        _.each(self.categories, function (groups, categoryLabel) {
          _.each(groups, function (group) {
            selectedGroups[group.id] = true;
          });
          selectedGroups[NOT_IN_PREFIX + categoryLabel] = true;
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


  function toggleNotInCategory (categoryLabel) {
    selectedGroups[NOT_IN_PREFIX + categoryLabel] = !selectedGroups[NOT_IN_PREFIX + categoryLabel];
    emitChangeNotification();
  }

  function isNotInCategorySelected (categoryLabel) {
    return selectedGroups[NOT_IN_PREFIX + categoryLabel];
  }


  /**
   * Determine if the current category is selected. Categories are deemed
   * to be selected if all the groups within them are selected.
   * @param  {String}  the name of the category
   * @return {Boolean}        `true` IFF all groups in the category are selected
   */
  function isCategorySelected (categoryLabel) {
    let groups = self.categories[categoryLabel];
    return groups
        && !_.find(groups, function(group){ return !selectedGroups[group.id]; })
        && isNotInCategorySelected(categoryLabel);
  }

  function toggleCategory (categoryLabel) {
    let groups = self.categories[categoryLabel];
    let targetState = !isCategorySelected(categoryLabel);

    _.each(groups, function (group) {
      selectedGroups[group.id] = targetState;
    });
    selectedGroups[NOT_IN_PREFIX + categoryLabel] = targetState;
    emitChangeNotification();
  }

  function emitChangeNotification() {
    if (typeof self.onFilterChange === 'function') {
      self.onFilterChange({participantIDs: getSelectedParticipantIDs()});
    }
  }

  function getSelectedParticipantIDs () {

    var participantsInSelectedGroups = _.map(self.categories, function (groups) {
      return _.filter(groups, self.isGroupSelected).map(function (group) {
        return group.participantList;
      });
    });

    var categoriesSelected = _.filter(self.categories, function (groups, categoryLabel) {
      return isNotInCategorySelected(categoryLabel);
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

