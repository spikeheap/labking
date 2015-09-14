'use strict';

module.exports = ParticipantGroupFilterController;

/** @ngInject **/
function ParticipantGroupFilterController(ParticipantGroupsService) {
  const _ = require('lodash');
  let self = this;

  let selectedGroups = [];

  self.isCategorySelected = isCategorySelected;
  self.toggleCategory = toggleCategory;

  self.isGroupSelected = isGroupSelected;
  self.participantCount = function () { console.log("TODO"); return 10; }
  self.toggleGroup = toggleGroup;

  activate();

  /**
   * Private methods
   */


  function activate () {
    ParticipantGroupsService.getParticipantGroupCategories()
      .then(function (participantGroupCategories) {
        self.categories = participantGroupCategories;

        // set initial state to selected
        _.each(self.categories, function (groups) {
          _.each(groups, function (group) {
            selectedGroups[group.id] = true;
          });
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

  /**
   * Determine if the current category is selected. Categories are deemed
   * to be selected if all the groups within them are selected.
   * @param  {String}  the name of the category
   * @return {Boolean}        `true` IFF all groups in the category are selected
   */
  function isCategorySelected (categoryLabel) {
    let groups = self.categories[categoryLabel];
    return groups && !_.find(groups, function(group){ return !selectedGroups[group.id] });
  }

  function toggleCategory (categoryLabel) {
    let groups = self.categories[categoryLabel];
    let targetState = !isCategorySelected(categoryLabel);

    _.each(groups, function (group) {
      selectedGroups[group.id] = targetState;
    });
    emitChangeNotification();
  }

  function emitChangeNotification() {
    if (typeof self.onFilterChange === 'function') {
      self.onFilterChange({participantIDs: getSelectedParticipantIDs()});
    }
  }

  function getSelectedParticipantIDs () {
    var idsByGroup = _.map(self.categories, function (groups) {
      return _.filter(groups, self.isGroupSelected).map(function (group) {
        return group.participantList;
      });
    });

    return _.uniq(_.flattenDeep(idsByGroup));
  }
}

