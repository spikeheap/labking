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
        tabHeaders.push(<li key={i} className="horizontal-multiline-menu-item"><a className="pure-menu-link" onClick={this.handleTabClick.bind(this, i)}>{item.label}</a></li>);
      }.bind(this));

      if(this.props.tabs[this.state.activeTabId] !== undefined){
        tabContent = this.props.tabs[this.state.activeTabId].content;
      }

      return (
        <div>
          <div className="pure-menu">
            <ul className="pure-menu-list">
              {tabHeaders}
            </ul>
          </div>
          <div>{tabContent}</div>
        </div>
      );
    }
  });

  module.exports = TabSet;
}());

