

// Wraps queries to ensure the LabKey Ext libraries are present and loaded.
function labkeyQuery(schemaName, queryName){
  return new Promise(function(resolve, reject) {
    LABKEY.requiresExt3ClientAPI(true, function() {
      Ext.onReady(function() {
        LABKEY.Query.selectRows({ schemaName: schemaName, queryName: queryName, success: resolve, failure: reject});
      });
    });
  });
}

/**
 * API calls, all returning promises
 **/

   // function getParticipantById(participantId) {

  //   // For each dataset
  //   // - get the participant"s entries
  //   LABKEY.Query.selectRows({
  //     schemaName: "study",
  //     queryName: "Database_Enrollment",
  //     filterArray: [
  //       LABKEY.Filter.create("ParticipantId", participantId)
  //     ],
  //     success: function(data){ 
  //       console.log(data);
  //       var demoData = data.rows.map(function(participantGroup) {
  //         return buildListItemHTML(participantGroup.Label);
  //       });
  //       $( ".editable-participant .participant-demographics" ).append( demoData.join("") );
  //     }
  //   });
  // }


function getParticipants(){
  return labkeyQuery("study", "Participant");
}

function getCohorts(){
  return labkeyQuery("study", "Cohort");
}

// A participant cateogory contains many participant groups.
// A participant may only belong to one group within each category
function getParticipantCategories(){
  return labkeyQuery("study", "ParticipantCategory");
}

function getParticipantGroups(){
  return labkeyQuery("study", "ParticipantGroup");
}

// This contains the relationships between participants and participant groups
function getParticipantGroupMaps(){
  return labkeyQuery("study", "ParticipantGroupMap");
}

module.exports = {
  getParticipants: getParticipants,
  getCohorts: getCohorts,
  getParticipantCategories: getParticipantCategories,
  getParticipantGroups: getParticipantGroups,
  getParticipantGroupMaps: getParticipantGroupMaps,
};
