var React = require("react"),
    ReactPropTypes = React.PropTypes;


var CohortList = require("./CohortList.jsx"),
    ParticipantList = require("./ParticipantList.jsx");
//var TodoActions = require("../actions/TodoActions");

var ParticipantFilter = React.createClass({

  propTypes: {
    cohorts: ReactPropTypes.array.isRequired,
    participants: ReactPropTypes.array.isRequired,
    cohortFilter: ReactPropTypes.object.isRequired
  },

  render: function() {
    return (
      <div>
        <CohortList 
          cohorts={this.props.cohorts}
          checkedCohorts={this.props.cohortFilter}
        />

        <ParticipantList 
          participants={this.props.participants}
          cohortFilter={this.props.cohortFilter}
        />
      </div>
    );
  }

  // /**
  //  * Event handler to mark all TODOs as complete
  //  */
  // _onToggleCompleteAll: function() {
  //   //TodoActions.toggleCompleteAll();
  // }

});

module.exports = ParticipantFilter;
