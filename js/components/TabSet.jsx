(function () {
  "use strict";

  var React = require("react");

  var TabSet = React.createClass({

    propTypes: {
      tabs: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return {
            activeTabId: 1,
        };
    },
    handleTabClick: function(itemIndex) {
        this.setState({activeTabId: itemIndex});
    },
    render: function() {
      var tabHeaders = [];

      this.props.tabs.forEach(function(item, i) {
        tabHeaders.push(<li><a key={i} onClick={this.handleTabClick.bind(this, i)}>{item.Label}</a></li>);
      }.bind(this));

      return (
        <div>
          <ul>
            {tabHeaders}
          </ul>
          <div>
            <h3>{this.props.tabs[this.state.activeTabId].Label}</h3>
          </div>
        </div>
      );
    }
  });

  module.exports = TabSet;
}());

