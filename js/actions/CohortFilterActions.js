var Marty = require('marty');

var CohortFilterConstants = require('../constants/CohortFilterConstants');

class CohortFilterActions extends Marty.ActionCreators {
  addCohort(cohort) {
    this.dispatch(CohortFilterConstants.COHORT_ADD, cohort)
  }
  removeCohort(cohort) {
    this.dispatch(CohortFilterConstants.COHORT_REMOVE, cohort)
  }
}

module.exports = Marty.register(CohortFilterActions);
