var Marty = require('marty');

var StudyConstants = require('../constants/StudyConstants');

class StudyActions extends Marty.ActionCreators {
  addCohort(cohort) {
    this.dispatch(StudyConstants.COHORT_ADD, cohort)
  }
  removeCohort(cohort) {
    this.dispatch(StudyConstants.COHORT_REMOVE, cohort)
  }
}

module.exports = Marty.register(StudyActions);
