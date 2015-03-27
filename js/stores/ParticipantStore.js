(function () {
  "use strict";

  var _ = require("lodash"),
      Marty = require("marty");

  var ParticipantConstants = require("../constants/ParticipantConstants");

  var ParticipantStore = Marty.createStore({
    id: "ParticipantStore",
    handlers: {
      create: ParticipantConstants.PARTICIPANT_CREATE,
      update: ParticipantConstants.PARTICIPANT_UPDATE
    },

    getInitialState: function () {
      return {};
    },

    /**
     * Create a Participant.
     * @param  {string} text The content of the TODO
     */
    create: function (text) {
      console.log(text);
      // FIXME: this needs implementing!
      // text = text.trim();

      // if (text) {
      //   // Hand waving here -- not showing how this interacts with XHR or persistent
      //   // server-side storage.
      //   // Using the current timestamp + random number in place of a real id.
      //   var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
      //   this.state[id] = {
      //     id: id,
      //     complete: false,
      //     text: text
      //   };
      //   this.hasChanged();
      // }
    },

    /**
     * Update a Participant.
     * @param  {string} id
     * @param {object} updates An object literal containing only the data to be updated.
     */
    update: function (id, props) {
      this.state[id] = _.extend({}, this.state[id], props);
      this.hasChanged();
    }
  });

  module.exports = ParticipantStore;
}());
