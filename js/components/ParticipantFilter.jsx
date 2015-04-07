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
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-4">
            <CohortList />
          </div>
          <div className="pure-u-1 pure-u-md-3-4">
            <ParticipantList onSelectedParticipantChange={this.props.onSelectedParticipantChange}/>
          </div>
        </div>
      );
    }
  });

  module.exports = ParticipantFilter;
}());

