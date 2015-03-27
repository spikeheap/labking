(function() {
  "use strict";
  //var $ = require("jQuery");

  var React = require("react");

  var LabKingApp = require("./components/LabKingApp.jsx");

  // require("marty").dispatcher.getDefault().register(function (action) {
  //   console.log("ACTION:", action.type, action.arguments)
  // });

  React.render(
    <LabKingApp />,
    document.getElementById("labking-app")
  );

}());

