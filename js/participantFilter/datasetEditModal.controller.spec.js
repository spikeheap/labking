'use strict';
require('babelify/polyfill');
describe('DatasetEditModalController', function () {
  var $q;
  var $rootScope;
  var $controller;
  var DatasetMetadataService;
  var controller;

  beforeEach(angular.mock.module('labking.participantFilter'));

  beforeEach(inject(function(_$rootScope_, _$q_, _$controller_, _DatasetMetadataService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
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

  describe('isColumnShown', function () {
    it('hides columns with a `hidden` attribute', function () {
      expect(controller.isColumnShown('hiddenColumn')).to.equal(false);
    });

    it('shows columns with no `hidden` attribute', function () {
      expect(controller.isColumnShown('shownColumn')).to.equal(true);
    });

    describe('non-demographic datasets', function () {
      it('shows `date` columns', function () {
        expect(controller.isColumnShown('date')).to.equal(true);
      });

      it('shows `ParticipantId` columns', function () {
        expect(controller.isColumnShown('ParticipantId')).to.equal(true);
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
        expect(controller.isColumnShown('date')).to.equal(false);
      });

      it('hides `ParticipantId` columns', function () {
        expect(controller.isColumnShown('ParticipantId')).to.equal(false);
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
