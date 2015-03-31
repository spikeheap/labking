(function () {
  "use strict";
  var React = require("react"),
      Marty = require("marty");

  // components
  var ParticipantFilter = require("./ParticipantFilter.jsx"),
      ParticipantRecord = require("./ParticipantRecord.jsx");

  var LabKingApp = React.createClass({

    render: function() {
      return (
        <div>
          <h1>Participant Filter</h1>
          <ParticipantFilter />

          <ParticipantRecord />
        </div>
      );
    }
  });

  module.exports = LabKingApp;
}());
