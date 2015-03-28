

var CohortFilterStore = require('./CohortFilterStore');

var uniqueId = 0;

function generateCohort(){
  uniqueId = uniqueId+1;
  return {
    description: null,
    enrolled: true,
    label: "Cohort "+uniqueId,
    rowid: uniqueId,
    participantCount: null
  };
}

function generateParitipant(cohortId){
  uniqueId = uniqueId+1;
  return {
    Cohort: cohortId,
    Container: "some-container",
    CurrentLocationId: null,
    EnrollmentLocationId: null,
    InitialCohort: cohortId,
    ParticipantId: "HEP-000"+uniqueId,
    StartDate: "2015/03/05 00:00:00",
    Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
    _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
    _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0001"
  };
}

describe('PartipantCategories', function() {
  xit('adds all ParticipantGroups for a ParticipantCategory', function() {
    
  });

  xit('removes all ParticipantGroups for a ParticipantCategory', function() {
    
  });
});

describe('filtered participants', function() {

  var cohort;

  beforeEach(function() {
    cohort = generateCohort()
    CohortFilterStore.setState({
      allParticipants: [
        generateParitipant(cohort.rowid+1),
        generateParitipant(cohort.rowid+5),
        generateParitipant(cohort.rowid),
        generateParitipant(cohort.rowid),
        generateParitipant(cohort.rowid)
      ]
    });
    CohortFilterStore.addCohortToFilter(cohort);
  });

  xit('includes participants from the ParticipantGroup filter', function() {
    
  });

  it('includes participants from the Cohort filter', function() {
    var filteredParticipants = CohortFilterStore.getFilteredParticipants();
    expect(filteredParticipants.length).to.equal(3);
    filteredParticipants.forEach(function(participant) {
      expect(participant.Cohort).to.equal(cohort.rowid);
    });
  });
});
