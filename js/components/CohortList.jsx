var _ = require('lodash'),
    React = require("react"),
    ReactPropTypes = React.PropTypes;

var CheckboxWithLabel = require("./CheckboxWithLabel.jsx"),
    CohortFilterActions = require("../actions/CohortFilterActions");

var CohortList = React.createClass({
  propTypes: {
    cohorts: ReactPropTypes.array.isRequired,
    checkedCohorts: React.PropTypes.object.isRequired
  },

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

module.exports = CohortList;
