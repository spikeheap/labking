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
      });
  }

  function isGroupSelected (group) {
    return group && selectedGroups[group.id];
  }

  function toggleGroup (group) {
    selectedGroups[group.id] = !selectedGroups[group.id]
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
  }
}

