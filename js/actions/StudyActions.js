var Marty = require('marty');

var StudyConstants = require('../constants/StudyConstants');

class StudyActions extends Marty.ActionCreators {
  addCohort(cohort) {
    this.dispatch(StudyConstants.COHORT_ADD, cohort)
  }
  removeCohort(cohort) {
    this.dispatch(StudyConstants.COHORT_REMOVE, cohort)
  }
  ensureParticipantIsPresent(participantId) {
    this.dispatch(StudyConstants.GET_PARTICIPANT, participantId)
  }
}

module.exports = Marty.register(StudyActions);
