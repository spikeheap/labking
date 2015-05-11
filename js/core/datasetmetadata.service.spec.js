// 'use strict';

// describe('DataSetMetadataService', function() {
//   var DatasetMetadataService, $rootScope, $q, $timeout;
//   var expectedLookups = [{rows: ['1']}];

//   beforeEach(angular.mock.module('labking.core', function($provide) {
//     $provide.value('LabKeyAPI', {
//         getLookups: function() {
//           return Promise.resolve(expectedLookups)
//         }
//       });
//   }));

//   beforeEach( inject( function(_$rootScope_, _$q_, _$timeout_, _DatasetMetadataService_){
//     $q = _$q_;
//     $timeout = _$timeout_;
//     $rootScope = _$rootScope_;
//     DatasetMetadataService = _DatasetMetadataService_;
//   }));

//   describe('getLookups', function () {
//     var lookupResult;


//     beforeEach(function() {
//       var LabKeyAPI = undefined;
//       lookupResult = DatasetMetadataService.getLookups();
//       $timeout.flush();
//       $rootScope.$apply()
//       // This is a hack. Please come up with a better solution ;)
//       // setTimeout(function() {
//       //   $rootScope.$apply()
//       // }, 100);
//     });

//     it('returns a promise', function (done) {
//       lookupResult.then(function() {
//         done();
//       });
//     });

//     // it('returns the lookups', function (done) {
//     //   lookupResult.then(function(lookups) {
//     //     //expect(lookups).toEqual(expectedLookups);
//     //     done();
//     //   });
//     // });
//   })
// });
