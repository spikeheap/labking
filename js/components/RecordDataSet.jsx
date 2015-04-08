(function () {
  "use strict";

  var React = require("react");

  var RecordDataSet = React.createClass({

    propTypes: {
      editable: React.PropTypes.bool.isRequired,
      dataSetMetaData: React.PropTypes.object.isRequired,
      participantDataSet: React.PropTypes.object
    },

    render: function() {

      var fields = this.props.dataSetMetaData.columns.map( (column) => {
        var dataSet = (this.props.participantDataSet !== undefined) ? this.props.participantDataSet : {};
        return (<div className="pure-control-group">
                  <label htmlFor="{column.Label}">{column.Label}</label>
                  <input id="{column.Label}" type="text" value={dataSet[column.Name]} />
              </div>);
      });

      return (
        <form className="pure-form pure-form-aligned">
          <fieldset>
            {fields}
          </fieldset>
        </form>
      );
    }
  });

  module.exports = RecordDataSet;
}());

