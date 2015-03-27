(function () {
  "use strict";
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

  module.exports = LabKingApp;

}());
