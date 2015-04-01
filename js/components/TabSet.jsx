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
      var tabContent;
      var tabHeaders = [];

      this.props.tabs.forEach(function(item, i) {
        tabHeaders.push(<li key={i}><a onClick={this.handleTabClick.bind(this, i)}>{item.label}</a></li>);
      }.bind(this));

      if(this.props.tabs[this.state.activeTabId] !== undefined){
        tabContent = this.props.tabs[this.state.activeTabId].content;
      }

      return (
        <div>
          <ul>
            {tabHeaders}
          </ul>
          <div>{tabContent}</div>
        </div>
      );
    }
  });

  module.exports = TabSet;
}());

