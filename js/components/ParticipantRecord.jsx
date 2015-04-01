(function () {
  "use strict";

  var React = require("react"),
      Marty = require("marty");


  var TabSet = require('./TabSet.jsx');
  var StudyStore = require("../stores/StudyStore");

  var ParticipantRecord = React.createClass({

    propTypes: {
      dataSetMetaData: React.PropTypes.array.isRequired,
      participant: React.PropTypes.object.isRequired
    },

    render: function() {
      var tabs = [];
      this.props.dataSetMetaData.forEach((dataSet) => {
        var content = dataSet.columns.map( (column) => {
          var result = (this.props.participant.dataSets[dataSet.Name] !== undefined) ? this.props.participant.dataSets[dataSet.Name][column.Name] : "N/A";
          return <li><strong>{dataSet.Name}</strong> {column.Label}: {result}</li>;
        });
        content = <ul>{content}</ul>;
        tabs.push({ label: dataSet.Label, content: content})
      }, this);

      return (
        <div>
          <h3>{this.props.participant}</h3>
          <TabSet tabs={tabs} />
        </div>
      );
    }
  });

  module.exports = Marty.createContainer(ParticipantRecord, {
    listenTo: StudyStore,
    fetch: {
      dataSetMetaData() { return StudyStore.getDataSetMetaData(); },
      participant() { return StudyStore.getParticipantRecord("HEP-0004"); }
    }
  });
}());

