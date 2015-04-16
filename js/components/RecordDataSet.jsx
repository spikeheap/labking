(function () {
  "use strict";

  var React = require("react");
  var forms = require("newforms");
  var Marty = require("marty");

  var StudyStore = require("../stores/StudyStore"),
      StudyActions = require("../actions/StudyActions");

  var RecordDataSet = React.createClass({

    propTypes: {
      editable: React.PropTypes.bool.isRequired,
      dataSetMetaData: React.PropTypes.object.isRequired,
      participantDataSet: React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        participantDataSet: {}
      };
    },

    handleSubmit: function(e) {
      e.preventDefault();
      console.log("save!");

      var form = this.refs.updateRecordDataSetForm.getForm();
      var isValid = form.validate();
      if (isValid) {
        console.log("VALID!");
        console.log(form.cleanedData);
      }else{
        console.log(form.errors());
      }
    },

    handleReset: function(e) {
      e.preventDefault();
      console.log("reset!");

      var form = this.refs.updateRecordDataSetForm.getForm();
      form.reset();
    },

    render: function() {

      var fieldSet = {};
      this.props.dataSetMetaData.columns.forEach( (column) => {
        if(column.RangeURI === "http://www.w3.org/2001/XMLSchema#dateTime"){
          fieldSet[column.Name] = forms.DateField({initial: this.props.participantDataSet[column.Name] || '', required: false, label: column.Label})
        }else{
          fieldSet[column.Name] = forms.CharField({initial: this.props.participantDataSet[column.Name] || '', required: false, label: column.Label})
        }
        
        // TODO date picker {widget: forms.DatePicker}
        // TODO multi-select
      });

      var RecordForm = forms.Form.extend(fieldSet);

      //console.log(this.props.lookupList);

      return (
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <forms.RenderForm form={RecordForm} ref="updateRecordDataSetForm"/>
          </fieldset>
          <fieldset>
            <input type="submit" value="Save changes" className="pure-button btn-success"/>
            <a className="pure-button btn-error pull-right" onClick={this.handleReset}>Reset form</a>
          </fieldset>
        </form>
      );
    }
  });

  module.exports = Marty.createContainer(RecordDataSet, {
    listenTo: StudyStore,
    fetch: {
       lookupList() { return StudyStore.getLookups(); }
    },
    failed(errors) {
      return <div className="error">{errors}</div>;
    },
    pending() {
      return <div>Loading...</div>
    }
  });
}());

