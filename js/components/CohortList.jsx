var _ = require('lodash'),
    React = require("react"),
    Marty = require("marty");

var CheckboxWithLabel = require("./CheckboxWithLabel.jsx"),
    StudyActions = require("../actions/StudyActions"),
    StudyStore = require("../stores/StudyStore");

var CohortList = React.createClass({

  toggleChecked: function(cohortLabel, currentState) {

    var cohort = _.find(this.props.cohorts, function(cohort) {
      return cohort.label === cohortLabel
    });

    if(currentState === true){
      StudyActions.removeCohort(cohort);
    }else{
      StudyActions.addCohort(cohort);
    }
  },

  render: function() {
    var cohorts = this.props.cohorts.map(function(cohort) {

      return <CheckboxWithLabel 
                key={cohort.rowid} 
                label={cohort.label} 
                isChecked={!!this.props.checkedCohorts[cohort.rowid]} 
                toggleChecked={this.toggleChecked}
                />
    }, this);
    

    return (
      <div>
        <h4>Cohort list</h4>
        <ul>
          {cohorts}
        </ul>
      </div>
    );
  }
});

module.exports = Marty.createContainer(CohortList, {
  listenTo: StudyStore,
  fetch: {
    cohorts() {                 return StudyStore.getCohorts(); },
    checkedCohorts() {          return StudyStore.getStudy(); },
  }
});
