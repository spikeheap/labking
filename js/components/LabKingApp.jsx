(function () {
  "use strict";
  var React = require("react"),
      Marty = require("marty");

  // components
  var ParticipantFilter = require("./ParticipantFilter.jsx"),
      ParticipantRecord = require("./ParticipantRecord.jsx");

  var StudyStore = require("../stores/StudyStore"),
      StudyActions = require("../actions/StudyActions");

  var LabKingApp = React.createClass({
    getInitialState: function() {
      return {}
    },

    changeSelectedParticipant: function(participantId) {
      StudyActions.ensureParticipantIsPresent(participantId);
      this.setState({ selectedParticipantId: participantId });
    },

    render: function() {
      // var participantRecord;
      // if(this.state.participantId){
      //   participantRecord = <ParticipantRecord 
      //       participant={this.props.participantRecords[0]}
      //       dataSetMetaData={this.props.dataSetMetaData} />
      // }else{
      //   participantRecord = <div>LOADING!</div>
      // }
      return (
        <div className="labking">
          <h1>Participant Filter</h1>
          <ParticipantFilter 
            onSelectedParticipantChange={this.changeSelectedParticipant}/>

          <hr/>
          
          <ParticipantRecord 
            dataSetMetaData={this.props.dataSetMetaData}
            participant= {this.props.participantRecords[this.state.selectedParticipantId]}/>
          
          <hr/>
        </div>
      );
    }
  });

  module.exports = Marty.createContainer(LabKingApp, {
    listenTo: StudyStore,
    fetch: {
      dataSetMetaData() { return StudyStore.getDataSetMetaData(); },
      participantRecords() { return StudyStore.getParticipantRecords(); }
    },
    failed(errors) {
      return <div className="error">{errors}</div>;
    },
    pending() {
      return <div>Loading...</div>
    }
  });
}());
