(function () {
  "use strict";

  var React = require("react"),
      ReactPropTypes = React.PropTypes;

  var CheckboxWithLabel = React.createClass({
    propTypes: {
      label: ReactPropTypes.string.isRequired,
      isChecked: ReactPropTypes.bool.isRequired,
      toggleChecked: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
      return {
        isChecked: this.props.isChecked
      };
    },

    onChange: function() {
      this.setState({isChecked: !this.state.isChecked});
      this.props.toggleChecked(this.props.label, this.state.isChecked);
    },

    render: function() {
      return (
        <li>
          <input
            className="toggle"
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.onChange}
          />
          <label>
            {this.props.label}
          </label>
        </li>
      );
    }
  });

  module.exports = CheckboxWithLabel;
}());

