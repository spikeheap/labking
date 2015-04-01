var _ = require('lodash'),
    React = require("react"),
    Marty = require("marty");

var StudyStore = require("../stores/StudyStore");

var ParticipantList = React.createClass({

  render: function() {
    var allParticipants = this.props.allParticipants;
    var participants = this.props.filteredParticipants.map(function(participant) {
      return <li key={participant.ParticipantId}>{participant.ParticipantId}</li>;
    });

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
