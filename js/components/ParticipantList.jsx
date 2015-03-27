var _ = require('lodash'),
    React = require("react"),
    ReactPropTypes = React.PropTypes;

var ParticipantList = React.createClass({
  propTypes: {
    participants: ReactPropTypes.array.isRequired,
    cohortFilter: ReactPropTypes.object.isRequired
  },

  render: function() {

    var participants = [];
    this.props.participants.forEach(function(participant) {
      if(_.any(this.props.cohortFilter, 'rowid', participant.InitialCohort)){
        return participants.push(<li key={participant.ParticipantId}>{participant.ParticipantId}</li>);
      }else{
        return null;
      }

    }, this);

    return (
      <div>
        <h4>Participants</h4>
        <ul>
          {participants}
        </ul>
      </div>
    );
  }
});

module.exports = ParticipantList;
