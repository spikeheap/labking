(function () {
  "use strict";

  var React = require("react");


  var TabSet = require('./TabSet.jsx');

  var ParticipantRecord = React.createClass({

    propTypes: {
      dataSetMetaData: React.PropTypes.array.isRequired,
      participant: React.PropTypes.object
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
        var content = dataSet.columns.map( (column) => {
          var result = (this.props.participant.dataSets[dataSet.Name] !== undefined) ? this.props.participant.dataSets[dataSet.Name][column.Name] : "N/A";
          return <li><strong>{column.Label}</strong> {result}</li>;
        });
        content = <ul>{content}</ul>;
        tabs.push({ label: dataSet.Label, content: content})
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

