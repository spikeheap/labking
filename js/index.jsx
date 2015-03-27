;(function(LABKEY, Ext) {
  "use strict";
  //var $ = require("jQuery");

  var React  = require("react");

  var LabKingApp = require("./components/LabKingApp.jsx");

  var participants = [
    {
        Cohort: 5,
        Container: "df71ab40-aec9-1032-9828-778d5d9fd950",
        CurrentLocationId: null,
        EnrollmentLocationId: null,
        InitialCohort: 5,
        ParticipantId: "HEP-0001",
        StartDate: "2015/03/05 00:00:00",
        Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
        _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
        _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0001"
    },
    {
        Cohort: 5,
        Container: "df71ab40-aec9-1032-9828-778d5d9fd950",
        CurrentLocationId: null,
        EnrollmentLocationId: null,
        InitialCohort: 5,
        ParticipantId: "HEP-0002",
        StartDate: "2015/03/05 00:00:00",
        Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
        _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
        _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0002"
    },
    {
        Cohort: 5,
        Container: "df71ab40-aec9-1032-9828-778d5d9fd950",
        CurrentLocationId: null,
        EnrollmentLocationId: null,
        InitialCohort: 5,
        ParticipantId: "HEP-0003",
        StartDate: "2015/03/05 00:00:00",
        Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
        _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
        _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0003"
    },
    {
        Cohort: 5,
        Container: "df71ab40-aec9-1032-9828-778d5d9fd950",
        CurrentLocationId: null,
        EnrollmentLocationId: null,
        InitialCohort: 5,
        ParticipantId: "HEP-0004",
        StartDate: "2015/03/05 00:00:00",
        Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
        _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
        _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0004"
    },
    {
        Cohort: 5,
        Container: "df71ab40-aec9-1032-9828-778d5d9fd950",
        CurrentLocationId: null,
        EnrollmentLocationId: null,
        InitialCohort: 5,
        ParticipantId: "HEP-0005",
        StartDate: "2015/03/05 00:00:00",
        Study: "df71ab40-aec9-1032-9828-778d5d9fd950",
        _labkeyurl_Container: "/labkey/project/HEP_test_1/begin.view?",
        _labkeyurl_ParticipantId: "/labkey/study/HEP_test_1/participant.view?participantId=HEP-0005"
    }
];
  var cohorts = [
    {
        description: null,
        enrolled: true,
        label: "Autoimmune Hepatitis",
        rowid: 1,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Combined Infection",
        rowid: 2,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Hepatitis B",
        rowid: 3,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Hepatitis B with Delta Co-Infection",
        rowid: 4,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Hepatitis C",
        rowid: 5,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Hepatitis E",
        rowid: 6,
        participantCount: null
    },
    {
        description: null,
        enrolled: true,
        label: "Other",
        rowid: 7,
        participantCount: null
    }
];

  React.render(
    <LabKingApp 
      cohorts={cohorts} 
      participants={participants}
    />,
    document.getElementById("labking-app")
  );



  // Ensure that page dependencies are loaded
  LABKEY.requiresExt3ClientAPI(true, function() {
    Ext.onReady(function() {
      LABKEY.Query.selectRows({ schemaName: "study", queryName: "Cohort",
        success: function(data){ 
          console.log(data);
          var cohortList = data.rows
        } 
      });
    });
  });

  // // Wraps a string in li tags
  // function buildListItemHTML(item) {
  //   return "<li>"+item+"</li>";
  // }

  // // Initialize the form by populating the Reagent drop-down list and
  // // entering data associated with the current user.
  // function init() {

  //   // Gets the list of cohorts
    LABKEY.Query.selectRows({ schemaName: "study", queryName: "Cohort",
      success: function(data){ 
        console.log(data);
        var cohortList = data.rows.map(function(cohort) {
          return buildListItemHTML(cohort.label);
        });
        $( ".editable-participant .cohort-list" ).append( cohortList.join("") );
      } 
    });

  //   // Gets the list of participant group categories
  //   LABKEY.Query.selectRows({ schemaName: "study", queryName: "ParticipantCategory",
  //     success: function(data){ 
  //       console.log(data);
  //       var participantGroupCategoryList = data.rows.map(function(participantGroupCategory) {
  //         return buildListItemHTML(participantGroupCategory.Label);
  //       });
  //       $( ".editable-participant .participant-group-category-list" ).append( participantGroupCategoryList.join("") );
  //     } 
  //   });

  //   // Gets the list of participant groups
  //   LABKEY.Query.selectRows({ schemaName: "study", queryName: "ParticipantGroup",
  //     success: function(data){ 
  //       console.log(data);
  //       var participantGroupList = data.rows.map(function(participantGroup) {
  //         return buildListItemHTML(participantGroup.Label);
  //       });
  //       $( ".editable-participant .participant-group-list" ).append( participantGroupList.join("") );
  //     } 
  //   });

  //   // Gets the participants associated with each participant group
  //   LABKEY.Query.selectRows({ schemaName: "study", queryName: "ParticipantGroupMap",
  //     success: function(data){ 
  //       console.log(data);
  //     } 
  //   });

  //   getParticipantById("HEP-0004");
  // }

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

}(window.LABKEY, window.Ext));

