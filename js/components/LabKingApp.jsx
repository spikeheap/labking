/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var React = require("react");

// components
var ParticipantFilter = require("./ParticipantFilter.jsx");

var LabKingApp = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Participant Filter</h1>
        <ParticipantFilter />
      </div>
    );
  }
});

module.exports = LabKingApp
