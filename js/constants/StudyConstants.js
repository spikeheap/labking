(function (module) {
  "use strict";
  var Marty = require("marty");

  module.exports = Marty.createConstants([
    "COHORT_ADD",
    "COHORT_REMOVE",
    "GET_PARTICIPANT",
    "RECEIVE_PARTICIPANT"
  ]);
}(module));
