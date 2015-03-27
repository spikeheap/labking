/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var React = require("react"),
    Marty = require("marty");

// components
var ParticipantFilter = require("./ParticipantFilter.jsx"),
    CohortFilterStore = require("../stores/CohortFilterStore");

var LabKingApp = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Participant Filter</h1>
        <ParticipantFilter
          cohorts={this.props.cohorts}
          cohortFilter={this.props.cohortFilter}
          participants={this.props.participants}
        />
      </div>
    );
  }
});

Marty.dispatcher.getDefault().register(function (action) {
  console.log("ACTION:")
  console.log(action.type) // => "UPDATE_EMAIL"
  console.log(action.arguments) // => [123, "foo@bar.com"];
  console.log("-----")
});

module.exports = Marty.createContainer(LabKingApp, {
  listenTo: CohortFilterStore,
  fetch: {
    cohorts() {
      return CohortFilterStore.getCohorts();
    },
    cohortFilter() {
      return CohortFilterStore.getCohortFilter();
    }
  }
});
