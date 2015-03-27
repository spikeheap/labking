var _ = require('lodash'),
    React = require("react"),
    Marty = require("marty");

var CheckboxWithLabel = require("./CheckboxWithLabel.jsx"),
    CohortFilterActions = require("../actions/CohortFilterActions"),
    CohortFilterStore = require("../stores/CohortFilterStore");

var CohortList = React.createClass({

  toggleChecked: function(cohortLabel, currentState) {

    var cohort = _.find(this.props.cohorts, function(cohort) {
      return cohort.label === cohortLabel
    });

    if(currentState === true){
      CohortFilterActions.removeCohort(cohort);
    }else{
      CohortFilterActions.addCohort(cohort);
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
  listenTo: CohortFilterStore,
  fetch: {
    cohorts() {                 return CohortFilterStore.getCohorts(); },
    checkedCohorts() {          return CohortFilterStore.getCohortFilter(); },
  }
});
