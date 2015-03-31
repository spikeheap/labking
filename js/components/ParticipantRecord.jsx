(function () {
  "use strict";

  var React = require("react"),
      Marty = require("marty");


  var TabSet = require('./TabSet.jsx');
  var CohortFilterStore = require("../stores/CohortFilterStore");

  var ParticipantRecord = React.createClass({

    propTypes: {
      dataSets: React.PropTypes.array.isRequired
    },

    render: function() {
      var dataSets = this.props.dataSets;
      var dataSetTabs = this.props.dataSets.map(function(dataSet) {
        return <li key={dataSet.Name}>{dataSet.Label}</li>
      });
      return (
        <div>
          <TabSet tabs={dataSets} />
        </div>
      );
    }
  });

  module.exports = Marty.createContainer(ParticipantRecord, {
    listenTo: CohortFilterStore,
    fetch: {
      dataSets() { return CohortFilterStore.getDataSets(); },
      participant() { return CohortFilterStore.getParticipantDataSet("HEP-0004", "Database_Enrollment"); }
    }
  });
}());

