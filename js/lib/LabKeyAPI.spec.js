
  'use strict';
  describe('ParticipantService', function() {

    var LabKeyAPI;// = require('./LabKeyAPI');

    describe('coerceDates', function () {

      var record = {
        'MRNNumber': '717528',
        'DOB': null,
        '_labkeyurl_ParticipantId': '/study/HEP/participant.view?participantId=HEP-0026',
        'date': '2015/02/23 00:00:00',
        'LastName': 'Test4',
        'FavouriteYear': 1993,
        'StartDate': '2015/02/23 00:00:00',
        'ParticipantId': 'HEP-0026',
        '_labkeyurl_HEPType': '/list/HEP/details.view?listId=68&pk=Hepatitis%20B',
        'HEPType': 'Hepatitis B',
        'FirstName': 'Test4',
        'lsid': 'urn:lsid:gmail.com:Study.Data-5:5030.HEP-0026',
        'NHSNumber': '4744902537'
      };

      var fieldsMetadata = [{
        'name': 'ParticipantId',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'ParticipantId'
      }, {
        'name': 'date',
        'friendlyType': 'Date and Time',
        'type': 'date',
        'jsonType': 'date',
        'sqlType': 'timestamp',
        'fieldKey': 'date',
        'format': 'dd-MMM-yyyy'
      }, {
        'name': 'StartDate',
        'friendlyType': 'Date and Time',
        'type': 'date',
        'jsonType': 'date',
        'sqlType': 'timestamp',
        'fieldKey': 'StartDate'
      }, {
        'name': 'HEPType',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'HEPType'
      }, {
        'name': 'FirstName',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'FirstName'
      }, {
        'name': 'LastName',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'LastName'
      }, {
        'name': 'NHSNumber',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'NHSNumber'
      }, {
        'name': 'DOB',
        'friendlyType': 'Date and Time',
        'type': 'date',
        'jsonType': 'date',
        'sqlType': 'timestamp',
        'fieldKey': 'DOB'
      }, {
        'name': 'MRNNumber',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'MRNNumber'
      }, {
        'name': 'FavouriteYear',
        'friendlyType': 'Integer',
        'type': 'int',
        'jsonType': 'int',
        'sqlType': 'int4',
        'fieldKey': 'FavouriteYear'
      }, {
        'name': 'lsid',
        'friendlyType': 'Text (String)',
        'type': 'string',
        'jsonType': 'string',
        'sqlType': 'varchar',
        'fieldKey': 'lsid'
      }];

      var result = LabKeyAPI.coerceToType(record, fieldsMetadata);

      it('coerces a date into a date', function () {
        result.StartDate.should.be.an.instanceof(Date);
        result.StartDate.should.equalDate( new Date(record.StartDate) );
      });

      it('coerces null dates to null', function () {
        // explicit assertion because `null` causes problems with the imperative syntax
        window.chai.assert.equal(result.DOB, null);
      });

      it('leaves strings as strings', function () {
        result.MRNNumber.should.be.a('string');
      });

      it('leaves numbers as numbers', function () {
        result.FavouriteYear.should.be.a('number');
      });
    });
  });

