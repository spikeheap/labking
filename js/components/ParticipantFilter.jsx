(function () {
  "use strict";

  var React = require("react");

  var CohortList = require("./CohortList.jsx"),
      ParticipantList = require("./ParticipantList.jsx");

  var ParticipantFilter = React.createClass({
    propTypes: {
      onSelectedParticipantChange: React.PropTypes.func.isRequired
    },
    render: function() {
      return (
        <div>
          <CohortList />

          <ParticipantList />
        </div>
      );
    }
  });

  module.exports = ParticipantFilter;
}());

