"use strict";

var _ = require('lodash');

class ParticipantGroup {
  constructor(id, label, category, participantList=[]) {
    this.id = id;
    this.label = label;
    this.category = category;
    this.participantList = participantList;
  }

  addParticipant(participant) {
    if(!_.includes(this.participantList, participant)){
      this.participantList.push(participant);
    }
  }

  removeParticipant(participant) {
    var index = this.participantList.indexOf(participant);
    if (index > -1) {
      this.participantList.splice(index, 1);
    }
    return index > -1;
  }
}

module.exports = ParticipantGroup;
