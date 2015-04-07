var _ = require('lodash'),
    React = require("react"),
    Marty = require("marty");

var StudyStore = require("../stores/StudyStore");

var ParticipantList = React.createClass({
  propTypes: {
    onSelectedParticipantChange: React.PropTypes.func.isRequired
  },
  changeSelectedParticipant: function(participantId) {
    console.log("ParticipantList");
    this.props.onSelectedParticipantChange(participantId);
  },
  render: function() {
    var self = this;
    var allParticipants = this.props.allParticipants;
    var participants = this.props.filteredParticipants.map(function(participant) {
      return <li key={participant.ParticipantId}>
              <a onClick={self.changeSelectedParticipant.bind(self, participant.ParticipantId)}>
                {participant.ParticipantId}
              </a>
            </li>;
    });

    participants = participants.length > 0 ? participants : <li>No participants match the current filter</li>;

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

module.exports = Marty.createContainer(ParticipantList, {
  listenTo: StudyStore,
  fetch: {
    allParticipants() { return StudyStore.getParticipants(); },
    filteredParticipants() { return StudyStore.getFilteredParticipants(); }
  }
});
