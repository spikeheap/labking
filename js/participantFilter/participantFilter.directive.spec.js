'use strict';
require('babelify/polyfill');

describe('ParticipantFilterController', function () {
  var $rootScope;
  var controller;
  var config;

  beforeEach(angular.mock.module('labking.participantFilter'));

  beforeEach(inject(function($controller, $modal, $q, _$rootScope_, _config_, CohortService, ParticipantService) {
    $rootScope = _$rootScope_;
    config = _config_;
    controller = $controller(require('./participantFilter.controller'), {
      $modal: $modal,
      $q: $q,
      $scope: $rootScope,
      config: config,
      CohortService: CohortService,
      ParticipantService: ParticipantService
    })
    //$rootScope.$digest();
  }));


  describe('participantSearchFilter', function () {
    var participant;

    beforeEach(function () {
      config.searchFields = ['field1', 'field2'];
      participant = {
        keyInfo: {
          field1: 'field1',
          field2: 'thisisfield2',
          field3: 'field3'
        }
      }
    });

    it('matches empty string searches', function () {
      controller.participantSearchText = '';
      expect(controller.participantSearchFilter(participant)).to.equal(true);
    });

    it('matches ignoring case', function () {
      controller.participantSearchText = 'FIELD1';
      expect(controller.participantSearchFilter(participant)).to.equal(true);
    });

    it('matches partial strings', function () {
      controller.participantSearchText = 'ld';
      expect(controller.participantSearchFilter(participant)).to.equal(true);
    });

    it('ignores non-search fields', function () {
      controller.participantSearchText = '3';
      expect(controller.participantSearchFilter(participant)).to.equal(false);
    });

  });
});
