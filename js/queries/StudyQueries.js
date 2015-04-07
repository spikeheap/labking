(function () {
  "use strict";
  var Marty = require("marty");
  var LabKeyAPI = require('../lib/LabKeyAPI');
  var StudyConstants = require('../constants/StudyConstants');


  class StudyQueries extends Marty.Queries {
    getParticipant(participantId){
      LabKeyAPI.getDataSets()
        .then((response) => {
            var participantDataSetPromises = response.rows.map((dataSet) => LabKeyAPI.getParticipantDataSet(participantId, dataSet.Name));
            return Promise.all(participantDataSetPromises);
          })
        .then((responsesArray) => {
            var dataSets = {};
            responsesArray.forEach((response) => {
              dataSets[response.queryName] = response.rows[0];
            });

            var participant = { dataSets: dataSets };
            this.dispatch(StudyConstants.RECEIVE_PARTICIPANT, participantId, participant);
          })
        .catch((error) => console.log("StudyQueries: Sad times", error));
    }
  }

  module.exports = Marty.register(StudyQueries);

}());
