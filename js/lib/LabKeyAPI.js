(function (LABKEY, Ext) {
  "use strict";

  // Wraps queries to ensure the LabKey Ext libraries are present and loaded.
  function labkeyQuery(schemaName, queryName, filterArray=[]){
    return new Promise(function(resolve, reject) {
      LABKEY.requiresExt3ClientAPI(true, function() {
        LABKEY.Query.selectRows({ 
          schemaName: schemaName, 
          queryName: queryName, 
          filterArray: filterArray,
          success: resolve, 
          failure: reject});
      });
    });
  }

  function createLabKeyFilter(field, value){
    return LABKEY.Filter.create(field, value);
  }

  /**
   * API calls, all returning promises
   **/

  function getParticipants(){
    return labkeyQuery("study", "Participant");
  }

  function getParticipantDataSet(participantId, dataSetId){
    return labkeyQuery("study", dataSetId, [createLabKeyFilter('ParticipantId', participantId)]);
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

  function getDataSets(){
    return labkeyQuery("study", "DataSets");
  }

  // Returns all column names for all datasets.
  // You can restrict to 
  function getDataSetsColumns(){
    return labkeyQuery("study", "DataSetColumns");
  }

  // Get the columns for a single dataset. This takes the `Name` attribute
  // (not to be confused with `Label`)
  function getDataSetColumns(dataSetName){
    return labkeyQuery("study", "DataSetColumns", [LABKEY.Filter.create('DataSet/Name', dataSetName)]);
  }

  function addDataSet(){
    LABKEY.Query.insertRows({
                schemaName: 'study',
                queryName: 'Database_Enrollment',
                rows: [
                  JSON.parse('{"ParticipantId":"HEP-0004","MRNNumber":"TEST0001","HCVEnroll":"Y","LCID":null,"MedWarNum":"402","LastName":"Hawking","StartDate":"2015/03/05 00:00:00","HCVRUKID":"TEST0001060-0065","HEPType":"Hepatitis C","FirstName":"Steve","NHSNumber":"TEST0001"}')
                ],
                successCallback: function(data){
                  console.log(data);
                },
         });  
  }

  module.exports = {
    getParticipants: getParticipants,
    getCohorts: getCohorts,
    getParticipantCategories: getParticipantCategories,
    getParticipantGroups: getParticipantGroups,
    getParticipantGroupMaps: getParticipantGroupMaps,
    getDataSets: getDataSets,
    getDataSetsColumns: getDataSetsColumns,
    getParticipantDataSet: getParticipantDataSet
  };

}(window.LABKEY));
