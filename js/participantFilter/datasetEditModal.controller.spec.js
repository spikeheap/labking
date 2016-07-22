'use strict';
require('babelify/polyfill');
describe('DatasetEditModalController', function () {
  var $q;
  var $rootScope;
  var $controller;
  var config;
  var DatasetMetadataService;
  var controller;

  beforeEach(angular.mock.module('labking.participantFilter'));

  beforeEach(inject(function(_$rootScope_, _$q_, _$controller_, _config_, _DatasetMetadataService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    config = _config_;
    DatasetMetadataService = _DatasetMetadataService_;
  }));

  beforeEach(function () {
    DatasetMetadataService.getMetaData = function () {
      return $q.when([{
        Name: 'test_schema',
        DemographicData: false,
        columns: [
          {Name: 'intColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#int'},
          {Name: 'doubleColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#double'},
          {Name: 'booleanColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#boolean'},
          {Name: 'stringColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#string'},
          {Name: 'dateTimeColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#dateTime'},
          {Name: 'multiLineColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#multiLine'}
        ]
      }, {
        Name: 'test_schema_demographic',
        DemographicData: true,
        columns: [
          {Name: 'someColumn', RangeURI: 'http://www.w3.org/2001/XMLSchema#int'}
        ]
      }]);
    };

    DatasetMetadataService.getColumnOrder = function () {
      return $q.when([
          {dataIndex: 'hiddenColumn', hidden: true},
          {dataIndex: 'shownColumn', hidden: false}
        ]);
    };
  });

  beforeEach(function () {
    controller = $controller('DatasetEditModalController', {
     '$modalInstance': {},
     'participantId': 1,
     'entry': {},
     'datasetName': 'test_schema',
     'onSave': {}
    });
    $rootScope.$digest();
  });

  describe('isDisabled', function () {

    it('returns false when the column is not the participant ID', function () {
      expect(controller.isDisabled({dataIndex: 'shownColumn', hidden: false})).to.equal(false);
    });
  });

  describe('isColumnShown', function () {
    it('hides columns with a `hidden` attribute', function () {
      expect(controller.isColumnShown({dataIndex: 'hiddenColumn', hidden: true})).to.equal(false);
    });

    it('shows columns with no `hidden` attribute', function () {
      expect(controller.isColumnShown({dataIndex: 'shownColumn', hidden: false})).to.equal(true);
    });

    it('hides subject noun columns when it is an existing subject', function () {
      expect(controller.isColumnShown({dataIndex: config.subjectNoun})).to.equal(false);
    });

    describe('non-demographic datasets', function () {
      it('shows `date` columns', function () {
        expect(controller.isColumnShown({dataIndex: 'date', hidden: false})).to.equal(true);
      });

      it('hides subject noun columns', function () {
        expect(controller.isColumnShown({dataIndex: config.subjectNoun, hidden: false})).to.equal(false);
      });
    });

    describe('demographic datasets', function () {
      beforeEach(function () {
        controller = $controller('DatasetEditModalController', {
         '$modalInstance': {},
         'participantId': 1,
         'entry': {},
         'datasetName': 'test_schema_demographic',
         'onSave': {}
        });
        $rootScope.$digest();
      });

      it('hides `date` columns', function () {
        expect(controller.isColumnShown({dataIndex: 'date', hidden: false})).to.equal(false);
      });

      it('hides subject noun columns', function () {
        config.subjectNoun = 'subjectNoun';
        expect(controller.isColumnShown({dataIndex: config.subjectNoun, hidden: false})).to.equal(false);
      });
    });

    describe('new subjects', function () {
      beforeEach(function () {
        controller = $controller('DatasetEditModalController', {
         '$modalInstance': {},
         'participantId': undefined,
         'entry': {},
         'datasetName': 'test_schema_demographic',
         'onSave': {}
        });
        $rootScope.$digest();
      });

      it('shows subject noun columns when it is a new subject', function () {
        expect(controller.isColumnShown({dataIndex: config.subjectNoun})).to.equal(true);
      });

      it('enables input for participant ID when config.subjectIdPrefix is undefined', function () {
        config.subjectIdPrefix = undefined;
        expect(controller.isDisabled({dataIndex: config.subjectNoun})).to.equal(false);
      });

      it('disables input for participant ID when config.subjectIdPrefix is set', function () {
        config.subjectIdPrefix = 'TEST-';
        expect(controller.isDisabled({dataIndex: config.subjectNoun})).to.equal(true);
      });
    });
  });

  describe('columnType', function () {
    it('resolves the INT type', function () {
      expect(controller.columnType('intColumn')).to.equal(controller.fieldTypes.INT);
      expect(controller.fieldTypes.INT).to.equal(0);
    });

    it('resolves the DOUBLE type', function () {
      expect(controller.columnType('doubleColumn')).to.equal(controller.fieldTypes.DOUBLE);
      expect(controller.fieldTypes.DOUBLE).to.equal(1);
    });

    it('resolves the BOOLEAN type', function () {
      expect(controller.columnType('booleanColumn')).to.equal(controller.fieldTypes.BOOLEAN);
      expect(controller.fieldTypes.BOOLEAN).to.equal(2);
    });

    it('resolves the STRING type', function () {
      expect(controller.columnType('stringColumn')).to.equal(controller.fieldTypes.STRING);
      expect(controller.fieldTypes.STRING).to.equal(3);
    });

    it('resolves the MULTILINE type', function () {
      expect(controller.columnType('multiLineColumn')).to.equal(controller.fieldTypes.MULTILINE);
      expect(controller.fieldTypes.MULTILINE).to.equal(4);
    });

    it('resolves the DATETIME type', function () {
      expect(controller.columnType('dateTimeColumn')).to.equal(controller.fieldTypes.DATETIME);
      expect(controller.fieldTypes.DATETIME).to.equal(6);
    });

    it('defaults to STRING', function () {
      expect(controller.columnType(undefined)).to.equal(controller.fieldTypes.STRING);
    });
  });
});
