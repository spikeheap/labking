(function () {
  "use strict";

  var React = require("react");

  var CohortList = require("./CohortList.jsx"),
      ParticipantList = require("./ParticipantList.jsx");

  var ParticipantFilter = React.createClass({

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

