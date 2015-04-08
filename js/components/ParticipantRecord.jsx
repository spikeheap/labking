(function () {
  "use strict";

  var React = require("react");


  var TabSet = require('./TabSet.jsx'),
      RecordDataSet = require('./RecordDataSet.jsx');

  var ParticipantRecord = React.createClass({

    propTypes: {
      dataSetMetaData: React.PropTypes.array.isRequired,
      participant: React.PropTypes.object
    },

    getInitialState: function() {
      return {editable: true};
    },

    render: function() {
      if(this.props.participant === undefined){
        return <div>No participant selected...</div>;
      }

      var dbEnrolmentValues = this.props.participant.dataSets['Database_Enrollment'];
      var participantKeyInfo = {
        name: `${dbEnrolmentValues.FirstName} ${dbEnrolmentValues.LastName}`,
        nhsNumber: dbEnrolmentValues.NHSNumber,
        mrnNumber: dbEnrolmentValues.MRNNumber
      }

      var tabs = [];
      this.props.dataSetMetaData.forEach((dataSet) => {
        tabs.push({ label: dataSet.Label, content: <RecordDataSet key={dataSet.Name} editable={this.state.editable} dataSetMetaData={dataSet} participantDataSet={this.props.participant.dataSets[dataSet.Name]} />})
      }, this);

      return (
        <div>
          <h3>{participantKeyInfo.name}</h3>
          <ul>
            <li>NHS #: {participantKeyInfo.nhsNumber}</li>
            <li>MRN #: {participantKeyInfo.mrnNumber}</li>
          </ul>
          <TabSet tabs={tabs} />
        </div>
      );
    }
  });

  module.exports = ParticipantRecord;
}());

