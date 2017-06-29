'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  User = mongoose.model('User'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests');

var admin = CommonUser.admin;
var leader = CommonUser.leader;
var member1 = CommonUser.member1;
var member2 = CommonUser.member2;
var team = CommonUser.team;
var organization = CommonUser.organization;
var station = CommonUser.station;
var station2 = CommonUser.station2;

/**
 * Globals
 */
var user,
  calendarEvent;

/**
 * Unit tests
 */
describe('Calendar Event Model Unit Tests:', function() {
  beforeEach(function(done) {
    User.findOne({ 'username': admin.username }).exec(function(err, adminUser) {
      should.not.exist(err);

      user = adminUser;
      calendarEvent = new CalendarEvent({
        title: 'Calendar Event',
        dates: [{
          startDateTime: moment().toDate(),
          endDateTime: moment().toDate()
        }],
        category: {
          type: '5833bfa1957940604da50cd0',
        },
        deadlineToRegister: moment().toDate(),
        location: {
          addressString: '123 Main St, New York, New York',
          latitude: 39.765,
          longitude: -76.234
        },
        cost: '$100 donation',
        maximumCapacity: 40,
        description: 'This is a test event',
        skillsTaught: 'How to add an event',
        featuredImage: {
          originalname: 'someimage.png',
          mimetype: 'image/png',
          filename: '1234567890.png',
          path: 'aws.com/1234567890.png'
        },
        resources: {
          teacherResourcesLinks: [{
            name: 'Link Resource 1',
            link: 'www.resource.com/resource1'
          }],
          teacherResourcesFiles: [{
            originalname: 'resourcefile.pdf',
            mimetype: 'application/pdf',
            filename: '0987654321.pdf',
            path: 'aws.com/0987654321.pdf'
          }]
        },
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return calendarEvent.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function(done) {
      calendarEvent.title = '';

      return calendarEvent.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without description', function(done) {
      calendarEvent.description = '';

      return calendarEvent.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    CalendarEvent.remove().exec(function() {
      done();
    });
  });
});
