'use strict';

var path = require('path'),
  moment = require('moment'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  signinAs = CommonUser.signinAs,
  signout = CommonUser.signout,
  signup = CommonUser.signup,
  CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  EC = protractor.ExpectedConditions;

describe('Event E2E Tests', function () {

  var admin = CommonUser.admin;
  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var newLeader = CommonUser.newLeader;
  var newStudent = CommonUser.newStudent;
  var team = CommonUser.team;
  var organization = CommonUser.organization;

  var resource1 = '../../../../scripts/test-files/resource.txt';
  var resource2 = '../../../../scripts/test-files/resource2.txt';

  var date1 = moment().add(7, 'days').startOf('day');
  var date1Field = date1.format('MM-DD-YYYY');
  var date1JSON = date1.format('YYYY-MM-DD');
  var date1StringMulti = date1.format('MMM D YYYY');
  var date1StringSingle = date1.format('MMM') + '\n' + date1.format('D') + '\n' + date1.format('YYYY');

  var date2 = moment().add(8, 'days').startOf('day');
  var date2Field = date2.format('MM-DD-YYYY');
  var date2JSON = date2.format('YYYY-MM-DD');
  var date2StringMulti = date2.format('MMM D YYYY');
  var date2StringSingle = date2.format('MMM') + '\n' + date2.format('D') + '\n' + date2.format('YYYY');
  var deadline1 = moment().add(5, 'days').startOf('day').format('MM-DD-YYYY');

  var initialEvent = {
    title: 'Initial Event',
    dates: [{
      date: date1Field,
      startTime: '13:00',
      endTime: '17:00',
      startDateTime: date1JSON+'T13:00:00.000Z',
      endDateTime: date1JSON+'T17:00:00.000Z',
      singleDateString: date1StringSingle,
      multiDateString: date1StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }],
    category: {
      type: 4,
      typeText: 'other',
      otherType: 'Meeting'
    },
    description: 'This is a description for initial event',
  };

  var fullEvent = {
    title: 'Updated Event',
    dates: [{
      date: date1Field,
      startTime: '13:00',
      endTime: '17:00',
      startDateTime: date1JSON+'T13:00:00.000Z',
      endDateTime: date1JSON+'T17:00:00.000Z',
      singleDateString: date1StringSingle,
      multiDateString: date1StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }, {
      date: date2Field,
      startTime: '14:00',
      endTime: '16:00',
      startDateTime: date2JSON+'T14:00:00.000Z',
      endDateTime: date2JSON+'T16:00:00.000Z',
      singleDateString: date2StringSingle,
      multiDateString: date2StringMulti,
      timeRangeString: '2:00pm-4:00pm'
    }],
    category: {
      type: 0,
      typeText: 'professional development',
    },
    description: 'This is a description for the updated event',
    deadlineToRegister: deadline1,
    location: {
      address: 'One Pace Plaza',
      addressString: 'One Pace Plaza, New York, NY 10038, USA',
      latitude: '40.7109684',
      longitude: '-74.0047403'
    },
    cost: '$100',
    maximumCapacity: 2,
    skillsTaught: 'Skill 1, skill 2, skill 3',
    featuredImage: true,
    resources: {
      resourcesLinks: [{
        name: 'Google',
        link: 'www.google.com'
      }],
      resourcesFiles: true
    }
  };

  var uploadFile = function(id, filepath) {
    var absolutePath = path.resolve(__dirname, filepath);
    var fileUploader = element(by.id(id));
    var input = fileUploader.element(by.css('input[type="file"]'));
    input.sendKeys(absolutePath);
    browser.sleep(500);
  };

  var assertFiles = function(id) {
    var fileList = element.all(by.id(id));
    fileList.get(0).getAttribute('href').then(function(text) {
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  };

  var saveWait = 450000;

  var fillInEvent = function(values) {
    element(by.model('vm.event.title')).clear().sendKeys(values.title);
    if (values.location) {
      element(by.css('a[data-target="#modal-event-map"]')).click();
      browser.sleep(500);
      element(by.model('vm.selectedPlace')).clear().sendKeys(values.location.address);
      element(by.model('vm.selectedPlace')).sendKeys(protractor.Key.ENTER);
      element(by.buttonText('Save')).click();
      browser.sleep(500);
    }
    if (values.cost) {
      element(by.model('vm.event.cost')).clear().sendKeys(values.cost);
    }
    element(by.model('vm.event.category.type')).all(by.tagName('option')).get(values.category.type).click();
    if (values.category.typeText === 'other') {
      element(by.model('vm.event.category.otherType')).clear().sendKeys(values.category.otherType);
    }

    var dates = element.all(by.repeater('date in vm.event.dates'));
    for (var i = 0; i < values.dates.length; i++) {
      if (i > 0) {
        element(by.css('a[ng-click="vm.addDate()"]')).click();
        dates = element.all(by.repeater('date in vm.event.dates'));
      }
      var dateFields = dates.get(i);
      var dateValues = values.dates[i];
      dateFields.element(by.model('date.date')).sendKeys(dateValues.date);
      dateFields.element(by.model('date.startTime')).sendKeys(dateValues.startTime);
      dateFields.element(by.model('date.endTime')).sendKeys(dateValues.endTime);
    }

    if (values.maximumCapacity) {
      element(by.model('vm.event.maximumCapacity')).clear().sendKeys(values.maximumCapacity);
    }
    if (values.deadlineToRegister) {
      element(by.model('vm.event.deadlineToRegister')).sendKeys(values.deadlineToRegister);
    }

    element(by.model('vm.event.description')).clear().sendKeys(values.description);
    if (values.skillsTaught) {
      element(by.model('vm.event.skillsTaught')).clear().sendKeys(values.skillsTaught);
    }
    if (values.featuredImage) uploadImage('event-featured-image');
    if (values.resources) {
      element(by.css('a[data-target="#modal-resources"]')).click();
      if (values.resources.resourcesLinks) {
        element(by.model('tempResourceLinkName')).clear().sendKeys(values.resources.resourcesLinks[0].name);
        element(by.model('tempResourceLink')).clear().sendKeys(values.resources.resourcesLinks[0].link);
      }
      if (values.resources.resourcesFiles) {
        element(by.css('a[href="#upload"]')).click();
        uploadFile('event-resources-file-dropzone', resource1);
        uploadFile('event-resources-file-dropzone', resource2);
      }
      element(by.buttonText('Add')).click();
      browser.sleep(500);
    }
  };

  var assertEvent = function(values, isAdmin, isTeamLead, isRegistered, registeredCount, isPast) {
    var openSpots = 0;
    if (values.maximumCapacity) {
      openSpots = (registeredCount > 0) ? values.maximumCapacity - registeredCount : values.maximumCapacity;
    }

    if (values.dates.length === 1) {
      expect(element(by.id('singleDateDisplay')).getText()).toEqual(values.dates[0].singleDateString + '\n' + values.dates[0].timeRangeString);
    } else {
      var dates = element.all(by.repeater('date in vm.event.dates'));
      for (var i = 0; i < values.dates.length; i++) {
        var multiDate = dates.get(i);
        expect(multiDate.getText()).toEqual(values.dates[i].multiDateString + '\n' + values.dates[i].timeRangeString);
      }
    }

    if (isRegistered) {
      expect(element(by.id('registeredForEvent')).getText()).toEqual('YOU ARE REGISTERED!\nUnregister');
      expect(element(by.css('a[ng-click="vm.unregisterEvent()"]')).isPresent()).toBe(true);
      expect(element(by.css('a[ng-click="vm.registerEvent()"]')).isDisplayed()).toBe(false);
    } else if (values.maximumCapacity && (isAdmin || isTeamLead)) {
      if (openSpots > 0) {
        expect(element(by.binding('vm.openSpots')).getText()).toEqual('ONLY ' + openSpots + ' SPOTS REMAINING');
        expect(element(by.css('a[ng-click="vm.registerEvent()"]')).isPresent()).toBe(true);
      } else {
        expect(element(by.id('noOpenSpotsLeft')).getText()).toEqual('REGISTRATION IS CLOSED');
        expect(element(by.css('a[ng-click="vm.registerEvent()"]')).isDisplayed()).toBe(false);
      }
    } else {
      expect(element(by.css('a[ng-click="vm.registerEvent()"]')).isPresent()).toBe(true);
    }

    expect(element(by.binding('vm.event.title')).getText()).toEqual(values.title);

    if (isAdmin) {
      expect(element(by.css('a[ui-sref="events.edit({ eventId: vm.event._id })"]')).isPresent()).toBe(true);
      expect(element(by.css('a[ng-click="vm.duplicateEvent()"]')).isPresent()).toBe(true);
      expect(element(by.css('a[ng-click="vm.openEmailRegistrants()"]')).isPresent()).toBe(true);
    } else {
      expect(element(by.css('a[ui-sref="events.edit({ eventId: vm.event._id })"]')).isDisplayed()).toBe(false);
      expect(element(by.css('a[ng-click="vm.duplicateEvent()"]')).isDisplayed()).toBe(false);
      expect(element(by.css('a[ng-click="vm.openEmailRegistrants()"]')).isDisplayed()).toBe(false);
    }
    if (values.location) {
      expect(element(by.binding('vm.event.location.addressString')).getText()).toEqual(values.location.addressString);
    }
    if (isPast) {
      expect(element(by.id('eventIsOver')).getText()).toEqual('Event is over');
    } else if (values.maximumCapacity && openSpots <= 0 && (isAdmin || isTeamLead)) {
      expect(element(by.id('noOpenSpotsLeft')).getText()).toEqual('REGISTRATION IS CLOSED');
    } else if (isAdmin || isTeamLead) {
      var daysRemaining = (values.deadlineToRegister) ? '4' : '6';
      expect(element(by.id('daysRemaining')).getText()).toEqual(daysRemaining + ' days left to register');
    }

    if (values.maximumCapacity && (isAdmin || isTeamLead)) {
      var registrants = (registeredCount) ? registeredCount : 0;
      expect(element(by.binding('vm.event.maximumCapacity')).getText()).toEqual(registrants + '/' +
        values.maximumCapacity + ' full');
    }

    if (isAdmin) {
      if (registeredCount > 0) {
        var registrantsList = element.all(by.repeater('registrant in vm.event.registrants'));
        if (registeredCount > 0) {
          var leaderRegistrant = registrantsList.get(0);
          expect(leaderRegistrant.getText()).toEqual(leader.displayName + ' ' + organization.name + ' ' +
            team.name + ' ' + leader.email + ' ' + moment().format('MMMM D, YYYY'));
        }
        if (registeredCount > 1) {
          var newLeaderRegistrant = registrantsList.get(1);
          expect(newLeaderRegistrant.getText()).toEqual(newLeader.displayName + ' ' + organization.name + ' ' +
            newLeader.email + ' ' + moment().format('MMMM D, YYYY'));
        }
      }
    }

    var categoryText = (values.category.typeText === 'other') ? values.category.otherType : values.category.typeText;
    categoryText = categoryText.charAt(0).toUpperCase() + categoryText.slice(1);
    expect(element(by.id('eventCategory')).getText()).toEqual(categoryText);
    expect(element(by.binding('vm.event.description')).getText()).toEqual(values.description);

    if (values.resources) {
      if (values.resources.resourcesFiles) {
        expect(element(by.partialLinkText('resource.txt')).isPresent()).toBe(true);
        expect(element(by.partialLinkText('resource2.txt')).isPresent()).toBe(true);
      }
      if (values.resources.resourcesLinks) {
        expect(element(by.partialLinkText(values.resources.resourcesLinks[0].name)).isPresent()).toBe(true);
      }
    }
    if (values.skillsTaught) {
      expect(element(by.binding('vm.event.skillsTaught')).getText()).toEqual('Skills taught: ' + values.skillsTaught);
    }
    if (values.cost) {
      expect(element(by.binding('vm.event.cost')).getText()).toEqual('Cost: ' + values.cost);
    }
  };

  describe('Full Event Creation Test', function() {
    describe('Create Event', function() {
      it('should create an event', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
        //Go to Create Event
        browser.get('http://localhost:8081/events/create');

        fillInEvent(initialEvent);

        element(by.buttonText('Create')).click();
        browser.sleep(500);
      });
      it ('should show the new event', function() {
        assertEvent(initialEvent, true, false, false, 0, false);
      });
      it('should update event with all fields', function() {
        element(by.id('editEvent')).click();
        browser.sleep(500);

        fillInEvent(fullEvent);

        element(by.buttonText('Update')).click();
        browser.sleep(1000);
      });
      it('should show the updated event', function() {
        browser.wait(EC.visibilityOf(element(by.id('view-event'))), 5000);
        assertEvent(fullEvent, true, false, false, 0, false);
      });
      it('should show event to leader', function() {
        //Sign in as leader
        signinAs(leader);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, false, true, false, 0, false);
      });
      it('should allow leader to register for event', function() {
        element(by.css('a[ng-click="vm.registerEvent()"]')).click();
        browser.sleep(500);

        var registeredModal = element(by.id('modal-event-register'));
        browser.wait(EC.visibilityOf(registeredModal), 5000);
        expect(registeredModal.isDisplayed()).toBe(true);
        registeredModal.element(by.buttonText('Close')).click();
        browser.wait(EC.invisibilityOf(registeredModal), 5000);
        browser.sleep(500);

        assertEvent(fullEvent, false, true, true, 1, false);
      });
      it('should show the registered user to the admin', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, true, false, false, 1, false);
      });
      it('should show event to guest', function() {
        //Signout user
        signout();

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, false, true, false, 1, false);
      });
      it('should allow guest to register for event', function() {
        browser.getCurrentUrl().then(function(currentUrl) {
          console.log('currentUrl', currentUrl);
          element(by.css('a[ng-click="vm.signinOrRegister()"]')).click();
          browser.sleep(500);

          //Assert that it went login page
          expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/authentication/signin');

          //Register new user
          element(by.css('a[href="/authentication/signup"]')).click();

          signup(newLeader);
          browser.sleep(500);

          //Assert that it went login page
          expect(browser.getCurrentUrl()).toEqual(currentUrl);

          element(by.css('a[ng-click="vm.registerEvent()"]')).click();
          browser.sleep(500);

          var registeredModal = element(by.id('modal-event-register'));
          browser.wait(EC.visibilityOf(registeredModal), 5000);
          expect(registeredModal.isDisplayed()).toBe(true);
          registeredModal.element(by.buttonText('Close')).click();
          browser.wait(EC.invisibilityOf(registeredModal), 5000);
          browser.sleep(500);

          //assertEvent(fullEvent, false, true, true, 2, false);
        });
      });
      it('should show the registered user to the admin', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, true, false, false, 2, false);
      });
    });
  });
});
