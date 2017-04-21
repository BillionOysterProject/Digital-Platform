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
  uploadFile = CommonExpedition.uploadFile,
  assertFiles = CommonExpedition.assertFiles,
  CommonCore = require('../../../core/tests/e2e/common-core.e2e.tests'),
  select2Fillin = CommonCore.select2Fillin,
  wysiwygFillin = CommonCore.wysiwygFillin,
  EC = protractor.ExpectedConditions;

xdescribe('Event E2E Tests', function () {

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
  var deadlineString1 = date1.format('MM/DD/YYYY');

  var date2 = moment().add(8, 'days').startOf('day');
  var date2Field = date2.format('MM-DD-YYYY');
  var date2JSON = date2.format('YYYY-MM-DD');
  var date2StringMulti = date2.format('MMM D YYYY');
  var date2StringSingle = date2.format('MMM') + '\n' + date2.format('D') + '\n' + date2.format('YYYY');
  var deadline1 = moment().add(5, 'days').startOf('day').format('MM-DD-YYYY');
  var deadlineString2 = moment().add(5, 'days').startOf('day').format('MM/DD/YYYY');

  var date3 = moment().startOf('day');
  var date3Field = date3.format('MM-DD-YYYY');
  var date3JSON = date3.format('YYYY-MM-DD');
  var date3StringMulti = date3.format('MMM D YYYY');
  var date3StringSingle = date3.format('MMM') + '\n' + date3.format('D') + '\n' + date3.format('YYYY');
  var deadlineString3 = date3.format('MM/DD/YYYY');

  var date4 = moment().startOf('day');
  var date4Field = date4.format('MM-DD-YYYY');
  var date4JSON = date4.format('YYYY-MM-DD');
  var date4StringMulti = date4.format('MMM D YYYY');
  var date4StringSingle = date4.format('MMM') + '\n' + date4.format('D') + '\n' + date4.format('YYYY');
  var deadline4 = moment().subtract(1, 'days').startOf('day').format('MM-DD-YYYY');
  var deadlineString4 = moment().subtract(1, 'days').startOf('day').format('MM/DD/YYYY');

  var initialEvent = {
    title: 'Initial Event',
    dates: [{
      date: date1Field,
      startTime: '01:00PM',
      endTime: '05:00PM',
      startDateTime: date1JSON+'T13:00:00.000Z',
      endDateTime: date1JSON+'T17:00:00.000Z',
      singleDateString: date1StringSingle,
      multiDateString: date1StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }],
    category: {
      type: 5,
      typeText: 'Other',
      otherType: 'Meeting'
    },
    description: 'This is a description for initial event',
    deadline: deadlineString1
  };

  var fullEvent = {
    title: 'Updated Event',
    dates: [{
      date: date1Field,
      startTime: '01:00PM',
      endTime: '05:00PM',
      startDateTime: date1JSON+'T13:00:00.000Z',
      endDateTime: date1JSON+'T17:00:00.000Z',
      singleDateString: date1StringSingle,
      multiDateString: date1StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }, {
      date: date2Field,
      startTime: '02:00PM',
      endTime: '04:00PM',
      startDateTime: date2JSON+'T14:00:00.000Z',
      endDateTime: date2JSON+'T16:00:00.000Z',
      singleDateString: date2StringSingle,
      multiDateString: date2StringMulti,
      timeRangeString: '2:00pm-4:00pm'
    }],
    category: {
      type: 2,
      typeText: 'Professional Development',
    },
    description: 'This is a description for the updated event',
    deadlineToRegister: deadline1,
    deadline: deadlineString2,
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
      resourceLinks: [{
        name: 'Google',
        link: 'www.google.com'
      }],
      resourceFiles: true
    }
  };

  var todayNoDeadlineEvent = {
    title: 'Today Event - No Deadline',
    dates: [{
      date: date3Field,
      startTime: '01:00PM',
      endTime: '05:00PM',
      startDateTime: date3JSON+'T13:00:00.000Z',
      endDateTime: date3JSON+'T17:00:00.000Z',
      singleDateString: date3StringSingle,
      multiDateString: date3StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }],
    category: {
      type: 2,
      typeText: 'Advanced Field Training',
    },
    maximumCapacity: 2,
    description: 'This is a description for today\'s event',
    deadline: deadlineString3
  };

  var todayDeadlineEvent = {
    title: 'Today Event - Deadline',
    dates: [{
      date: date4Field,
      startTime: '01:00PM',
      endTime: '05:00PM',
      startDateTime: date4JSON+'T13:00:00.000Z',
      endDateTime: date4JSON+'T17:00:00.000Z',
      singleDateString: date4StringSingle,
      multiDateString: date4StringMulti,
      timeRangeString: '1:00pm-5:00pm'
    }],
    category: {
      type: 4,
      typeText: 'Scientist Workshop',
    },
    deadlineToRegister: deadline4,
    description: 'This is a description for today\'s event',
    deadline: deadlineString4
  };

  var saveWait = 450000;

  var fillInEvent = function(values) {
    element(by.model('vm.event.title')).clear().sendKeys(values.title);
    if (values.location) {
      element(by.css('a[ng-click="vm.openMap()"]')).click();
      browser.sleep(500);
      element(by.model('vm.selectedPlace')).clear().sendKeys(values.location.address);
      element(by.model('vm.selectedPlace')).sendKeys(protractor.Key.ENTER);
      element(by.buttonText('Save')).click();
      browser.sleep(500);
    }
    if (values.cost) {
      element(by.model('vm.event.cost')).clear().sendKeys(values.cost);
    }
    element(by.id('category')).all(by.tagName('option')).get(values.category.type).click();
    if (values.category.typeText === 'Other') {
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

    wysiwygFillin('vm.event.description', values.description);
    if (values.skillsTaught) {
      wysiwygFillin('vm.event.skillsTaught', values.skillsTaught);
    }
    if (values.featuredImage) uploadImage('event-featured-image');
    if (values.resources) {
      element(by.css('a[data-target="#modal-resources"]')).click();
      browser.sleep(500);
      if (values.resources.resourceLinks) {
        element(by.model('tempResourceLinkName')).clear().sendKeys(values.resources.resourceLinks[0].name);
        element(by.model('tempResourceLink')).clear().sendKeys(values.resources.resourceLinks[0].link);
      }
      if (values.resources.resourceFiles) {
        element(by.css('a[href="#upload"]')).click();
        uploadFile('event-resources-file-dropzone', resource1);
        uploadFile('event-resources-file-dropzone', resource2);
      }
      element(by.buttonText('Add')).click();
      browser.sleep(500);
    }
  };

  var assertEvent = function(values, isAdmin, isTeamLead, isRegistered, registeredCount, isPast, isToday) {
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
    if (values.location && values.location.addressString) {
      expect(element(by.binding('vm.event.location.addressString')).getText()).toEqual(values.location.addressString);
    }
    if (isPast) {
      expect(element(by.id('eventIsOver')).getText()).toEqual('Event is over');
    } else if (isToday) {
      expect(element(by.id('eventIsToday')).getText()).toEqual('Event is today');
    }

    if (values.maximumCapacity && openSpots <= 0 && (isAdmin || isTeamLead)) {
      expect(element(by.id('noOpenSpotsLeft')).getText()).toEqual('REGISTRATION IS CLOSED');
    }

    if (isPast || (isToday && values.deadlineToRegister) || (values.maximumCapacity && openSpots === 0)) {
      expect(element(by.id('registrationClosed')).getText()).toEqual('Registration is closed\nRegistration deadline ' + values.deadline);
    } else if (isToday && !values.deadlineToRegister) {
      expect(element(by.id('registerToday')).getText()).toEqual('Last day to register!\nRegistration deadline ' + values.deadline);
    } else {
      var daysRemaining = (values.deadlineToRegister) ? '5' : '7';
      expect(element(by.id('daysRemaining')).getText()).toEqual(daysRemaining + ' days left to register\nRegistration deadline ' + values.deadline);
    }

    if (values.maximumCapacity && (isAdmin || isTeamLead)) {
      var registrants = (registeredCount) ? registeredCount : 0;
      expect(element(by.binding('vm.event.maximumCapacity')).getText()).toEqual(registrants + '/' +
        values.maximumCapacity + ' full');
    }

    if (isAdmin) {
      if (registeredCount > 0) {
        var registrantsList = element.all(by.repeater('registrant in vm.event.registrants'));
        // if (registeredCount > 0) {
        var leaderRegistrant = registrantsList.get(0);
        expect(leaderRegistrant.getText()).toEqual(leader.displayName + ' ' + organization.name + ' ' +
          team.name + ' ' + leader.email + ' ' + moment().format('MMMM D, YYYY') + ' Add note');
        // }
        // if (registeredCount > 1) {
        //   var newLeaderRegistrant = registrantsList.get(1);
        //   expect(newLeaderRegistrant.getText()).toEqual(newLeader.displayName + ' ' + organization.name + ' ' +
        //     'Default ' + newLeader.email + ' ' + moment().format('MMMM D, YYYY') + ' Add note');
        // }
      }
    }

    var categoryText = (values.category.typeText === 'Other') ? values.category.otherType : values.category.typeText;
    categoryText = categoryText.charAt(0).toUpperCase() + categoryText.slice(1);
    if (values.category.typeText === 'Other') {
      expect(element(by.id('eventCategory')).getText()).toEqual('Type: Other - ' + categoryText);
    } else {
      expect(element(by.id('eventCategory')).getText()).toEqual('Type: ' + categoryText);
    }
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
      expect(element(by.css('p[ng-show="vm.event.skillsTaught"]')).getText()).toEqual('Skills taught: ' + values.skillsTaught);
    }
    if (values.cost) {
      expect(element(by.binding('vm.event.cost')).getText()).toEqual('Cost: ' + values.cost);
    }
  };

  var assertEventListItem = function(item, values, openSpots, isPast, isToday) {
    var dates = item.all(by.repeater('date in calendarEvent.dates'));
    for (var i = 0; i < values.dates.length; i++) {
      var multiDate = dates.get(i);
      expect(multiDate.getText()).toEqual(values.dates[i].multiDateString + '\n' + values.dates[i].timeRangeString);
    }

    expect(item.element(by.binding('calendarEvent.title')).getText()).toEqual(values.title);

    if (values.location && values.location.addressString) {
      expect(item.element(by.css('p[ng-show="calendarEvent.location.addressString"]')).getText()).toEqual(values.location.addressString);
    }

    if (openSpots > 0) {
      expect(item.element(by.id('openSpots')).getText()).toEqual(values.maximumCapacity + ' spots');
      expect(item.element(by.id('openSpots')).isDisplayed()).toBe(true);
      expect(item.element(by.id('noOpenSpots')).isDisplayed()).toBe(false);
    } else if (openSpots === 0) {
      expect(item.element(by.id('noOpenSpots')).getText()).toEqual('Event is full');
      expect(item.element(by.id('noOpenSpots')).isDisplayed()).toBe(true);
      expect(item.element(by.id('openSpots')).isDisplayed()).toBe(false);
    } else {
      expect(item.element(by.id('openSpots')).isDisplayed()).toBe(false);
      expect(item.element(by.id('noOpenSpots')).isDisplayed()).toBe(false);
    }

    if (isPast || (isToday && values.deadlineToRegister) || openSpots <= 0) {
      expect(item.element(by.id('registrationClosed')).getText()).toEqual('Registration is closed');
    } else if (isToday && !values.deadlineToRegister) {
      expect(item.element(by.id('registerToday')).getText()).toEqual('Last day to register!');
    } else {
      var daysRemaining = (values.deadlineToRegister) ? '5' : '7';
      expect(item.element(by.id('registrationOpen')).getText()).toEqual(daysRemaining + ' days left to register');
    }
  };

  describe('Full Event Creation Test', function() {
    describe('Create Event', function() {
      it('should create an event', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        //Go to Create Event
        browser.get('http://localhost:8081/events/create');

        fillInEvent(initialEvent);

        element(by.buttonText('Create')).click();
        browser.sleep(500);
      });
      it ('should show the new event', function() {
        assertEvent(initialEvent, true, false, false, 0, false, false);
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
        assertEvent(fullEvent, true, false, false, 0, false, false);
      });
      it('should show event to leader', function() {
        //Sign in as leader
        signinAs(leader);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, false, true, false, 0, false, false);
      });
      it('should allow leader to register for event', function() {
        element(by.css('a[ng-click="vm.registerEvent()"]')).click();
        browser.sleep(500);

        var registeredModal = element(by.id('modal-event-register'));
        browser.wait(EC.visibilityOf(registeredModal), 5000);

        expect(registeredModal.isDisplayed()).toBe(true);
        expect(registeredModal.element(by.css('.modal-title')).getText()).toEqual('You are now registered for the ' +
          fullEvent.title + ' on ' + date1.format('MMMM D, YYYY, ') + fullEvent.dates[0].timeRangeString + ' | ' +
          date2.format('MMMM D, YYYY, ') + fullEvent.dates[1].timeRangeString);

        registeredModal.element(by.buttonText('Close')).click();
        browser.wait(EC.invisibilityOf(registeredModal), 5000);
        browser.sleep(500);

        assertEvent(fullEvent, false, true, true, 1, false, false);
      });
      it('should show the registered user to the admin', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();

        assertEvent(fullEvent, true, false, false, 1, false, false);
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

        assertEvent(fullEvent, false, true, false, 1, false, false);
      });
      it('should allow guest to register for event', function() {
        browser.getCurrentUrl().then(function(currentUrl) {
          element(by.css('a[ng-click="vm.signinOrRegister()"]')).click();
          browser.sleep(500);
          element(by.css('a[ng-click="signUp()"]')).click();
          browser.sleep(500);

          //Assert that it went login page
          expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/authentication/signup');

          //Register new user
          //element(by.css('a[href="/authentication/signup"]')).click();

          signup(newLeader);
          browser.sleep(500);

          //Assert that it went login page
          expect(browser.getCurrentUrl()).toEqual(currentUrl);

          element(by.css('a[ng-click="vm.registerEvent()"]')).click();
          browser.sleep(500);

          var registeredModal = element(by.id('modal-event-register'));
          browser.wait(EC.visibilityOf(registeredModal), 5000);

          expect(registeredModal.isDisplayed()).toBe(true);
          expect(registeredModal.element(by.css('.modal-title')).getText()).toEqual('You are now registered for the ' +
          fullEvent.title + ' on ' + date1.format('MMMM D, YYYY, ') + fullEvent.dates[0].timeRangeString + ' | ' +
          date2.format('MMMM D, YYYY, ') + fullEvent.dates[1].timeRangeString);

          registeredModal.element(by.buttonText('Close')).click();
          browser.wait(EC.invisibilityOf(registeredModal), 5000);
          browser.sleep(500);

          //assertEvent(fullEvent, false, true, true, 2, false, false);
        });
      });
      it('should show the registered user to the admin', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

        //Go to events
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        //Click on first event
        var events = element.all(by.repeater('calendarEvent in vm.events'));
        events.get(0).click();
        // browser.pause();
        assertEvent(fullEvent, true, false, false, 2, false, false);
      });
    });
  });

  describe('Today Event Tests', function() {
    describe('Create Today Test without Deadline', function() {
      it('should create an event', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        //Go to Create Event
        browser.get('http://localhost:8081/events/create');

        fillInEvent(todayNoDeadlineEvent);

        element(by.buttonText('Create')).click();
        browser.sleep(500);
      });
      it ('should show the new event', function() {
        assertEvent(todayNoDeadlineEvent, true, false, false, 0, false, true);
      });
    });
    describe('Create Today Test with Deadline', function() {
      it('should create an event', function() {
        //Sign in as admin
        signinAs(admin);
        //Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        //Go to Create Event
        browser.get('http://localhost:8081/events/create');

        fillInEvent(todayDeadlineEvent);

        element(by.buttonText('Create')).click();
        browser.sleep(500);
      });
      it ('should show the new event', function() {
        assertEvent(todayDeadlineEvent, true, false, false, 0, false, true);
      });
    });
  });
  describe('Event List Test', function() {
    describe('Check event list items', function() {
      var events;
      it ('should get event list', function() {
        //Go to Create Event
        browser.get('http://localhost:8081/events');
        browser.sleep(500);

        events = element.all(by.repeater('calendarEvent in vm.events'));
      });
      it ('should assert today event, no deadline', function() {
        assertEventListItem(events.get(0), todayNoDeadlineEvent, 2, false, true);
      });
      it ('should assert today event, deadline', function() {
        assertEventListItem(events.get(1), todayDeadlineEvent, null, false, true);
      });
      it ('should assert full event', function() {
        assertEventListItem(events.get(2), fullEvent, 0, false, false);
      });
    });
  });
  describe('Event Attendance Test', function() {
    it('should allow leader to register for todayNoDeadlineEvent', function() {
      //Sign in as leader
      signinAs(leader);
      //Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

      //Go to events
      browser.get('http://localhost:8081/events');
      browser.sleep(500);

      //Click on first event
      var events = element.all(by.repeater('calendarEvent in vm.events'));
      events.get(0).click();

      element(by.css('a[ng-click="vm.registerEvent()"]')).click();
      browser.sleep(500);
    });
    it('should allow newLeader to register for todayNoDeadlineEvent', function() {
      //Sign in as leader
      signinAs(newLeader);

      //Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

      //Go to events
      browser.get('http://localhost:8081/events');
      browser.sleep(500);

      //Click on first event
      var events = element.all(by.repeater('calendarEvent in vm.events'));
      events.get(0).click();

      element(by.css('a[ng-click="vm.registerEvent()"]')).click();
      browser.sleep(500);
    });
    it('should allow admin to mark attendance', function() {
      //Sign in as admin
      signinAs(admin);
      //Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
      //Go to Create Event
      browser.get('http://localhost:8081/events');
      browser.sleep(500);

      //Click on first event
      var events = element.all(by.repeater('calendarEvent in vm.events'));
      events.get(0).click();

      var registrants = element.all(by.repeater('registrant in vm.event.registrants'));
      var registrant1 = registrants.get(0);
      registrant1.element(by.css('a[ng-click="vm.notAttendedEvent(registrant)"]')).click();
      expect(registrant1.element(by.css('.btn-danger')).isDisplayed()).toBe(true);

      var registrant2 = registrants.get(1);
      registrant2.element(by.css('a[ng-click="vm.attendedEvent(registrant)"]')).click();
      expect(registrant2.element(by.css('.btn-success')).isDisplayed()).toBe(true);
    });
  });
});
