;(function(LABKEY, Ext) {
  'use strict';
  var $ = require('jQuery');
  
  // Ensure that page dependencies are loaded
  LABKEY.requiresExt3ClientAPI(true, function() {
    $( document ).ready( function() {
      Ext.onReady(init);
    });
  });

  // Wraps a string in li tags
  function buildListItemHTML(item) {
    return "<li>"+item+"</li>";
  }

  // Initialize the form by populating the Reagent drop-down list and
  // entering data associated with the current user.
  function init() {

    // Gets the list of cohorts
    LABKEY.Query.selectRows({ schemaName: 'study', queryName: 'Cohort',
      success: function(data){ 
        console.log(data);
        var cohortList = data.rows.map(function(cohort) {
          return buildListItemHTML(cohort.label);
        });
        $( ".editable-participant .cohort-list" ).append( cohortList.join('') );
      } 
    });

    // Gets the list of participant group categories
    LABKEY.Query.selectRows({ schemaName: 'study', queryName: 'ParticipantCategory',
      success: function(data){ 
        console.log(data);
        var participantGroupCategoryList = data.rows.map(function(participantGroupCategory) {
          return buildListItemHTML(participantGroupCategory.Label);
        });
        $( ".editable-participant .participant-group-category-list" ).append( participantGroupCategoryList.join('') );
      } 
    });

    // Gets the list of participant groups
    LABKEY.Query.selectRows({ schemaName: 'study', queryName: 'ParticipantGroup',
      success: function(data){ 
        console.log(data);
        var participantGroupList = data.rows.map(function(participantGroup) {
          return buildListItemHTML(participantGroup.Label);
        });
        $( ".editable-participant .participant-group-list" ).append( participantGroupList.join('') );
      } 
    });

    // Gets the participants associated with each participant group
    LABKEY.Query.selectRows({ schemaName: 'study', queryName: 'ParticipantGroupMap',
      success: function(data){ 
        console.log(data);
      } 
    });

    getParticipantById('HEP-0004');
  }

  function getParticipantById(participantId) {

    // For each dataset
    // - get the participant's entries
    LABKEY.Query.selectRows({
      schemaName: 'study',
      queryName: 'Database_Enrollment',
      filterArray: [
        LABKEY.Filter.create('ParticipantId', participantId)
      ],
      success: function(data){ 
        console.log(data);
        var demoData = data.rows.map(function(participantGroup) {
          return buildListItemHTML(participantGroup.Label);
        });
        $( ".editable-participant .participant-demographics" ).append( demoData.join('') );
      }
    });
  }

}(window.LABKEY, window.Ext));

