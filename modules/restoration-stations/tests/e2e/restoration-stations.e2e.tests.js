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

describe('Restoration Station E2E Tests', function() {
  var admin = CommonUser.admin;
  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var newLeader = CommonUser.newLeader;
  var newStudent = CommonUser.newStudent;
  var team = CommonUser.team;
  var organization = CommonUser.organization;

  var station3 = {
    name: 'New Station 1',
    location: {
      address: 'One Pace Plaza',
      addressString: 'One Pace Plaza, New York, NY 10038, USA',
      latitude: '40.7109684',
      longitude: '-74.0047403'
    },
    bodyOfWater: 'Jamaica Bay',
    boroughCounty: 'Nassau',
    status: 1,
    statusText: 'Active'
  };

  var station3update = {
    name: 'New Station 1 Updated',
    location: {
      address: 'One Pace Plaza',
      addressString: 'One Pace Plaza, New York, NY 10038, USA',
      latitude: '40.7109684',
      longitude: '-74.0047403'
    },
    bodyOfWater: 'Jamaica Bay',
    boroughCounty: 'Nassau',
    status: 1,
    statusText: 'Lost'
  };

  var station4 = {
    name: 'New Station 2',
    location: {
      address: 'One Pace Plaza',
      addressString: 'One Pace Plaza, New York, NY 10038, USA',
      latitude: '40.7109684',
      longitude: '-74.0047403'
    },
    bodyOfWater: 'Jamaica Bay',
    boroughCounty: 'Nassau',
    status: 1,
    statusText: 'Active'
  };

  var newORSLeader = {
    firstName: 'New ORS Leader',
    lastName: 'Local',
    email: 'neworsleader@localhost.com',
    userrole: 1,
    userroleText: 'team lead pending',
    typeLeadType: 1,
    typeLeadTypeText: 'Teacher',
    schoolOrg: 1,
    schoolOrgText: 'Org1',
    username: 'neworsleader',
    password: 'P@$$w0rd!!',
    displayName: 'New ORS Leader Local'
  };

  var fillInORS = function(values, isUpdate) {
    element(by.model('station.name')).clear().sendKeys(values.name);
    element(by.model('station.status')).all(by.tagName('option')).get(values.status).click();
    element(by.model('station.bodyOfWater')).clear().sendKeys(values.bodyOfWater).click();
    element(by.model('station.boroughCounty')).clear().sendKeys(values.boroughCounty).click();
    element(by.model('vm.selectedPlace')).clear().sendKeys(values.location.address);
    element(by.model('vm.selectedPlace')).sendKeys(protractor.Key.ENTER);
    uploadImage('ors-image-dropzone');
    element(by.buttonText((isUpdate) ? 'Update' : 'Register')).click();
  };

  describe('ORS CRUD Tests', function() {
    it('should allow team lead to create an ORS', function() {
      //Sign in as leader
      signinAs(leader);
      //Assert that it went to correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to Dashboard
      browser.get('http://localhost:8081/restoration-stations');

      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(2);

      // Open register ORS modal
      element(by.id('register-an-ORS')).click();
      browser.sleep(500);

      fillInORS(station3, false);
      browser.sleep(1000);

      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3.name + '\n' + station3.location.latitude + ', ' +
        station3.location.longitude + '\n' + station3.bodyOfWater + ' Active');
    });
    it('should allow team lead to edit an ORS', function() {
      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3.name + '\n' + station3.location.latitude + ', ' +
        station3.location.longitude + '\n' + station3.bodyOfWater + ' ' + station3.statusText);

      // Open edit ORS modal
      ors.click();
      browser.sleep(500);

      fillInORS(station3update, true);
      browser.sleep(1000);

      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      ors = orses.get(0);
      expect(ors.getText()).toEqual(station3update.name + '\n' + station3update.location.latitude + ', ' +
        station3update.location.longitude + '\n' + station3update.bodyOfWater + ' ' + station3update.statusText);
    });
    it('should allow team lead to delete an ORS', function() {
      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3update.name + '\n' + station3update.location.latitude + ', ' +
        station3update.location.longitude + '\n' + station3update.bodyOfWater + ' ' + station3update.statusText);

      // Open edit ORS modal
      ors.click();
      browser.sleep(500);

      element(by.buttonText('Delete')).click();
      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(2);
    });
  });
  describe('New Team Lead ORS Tests', function() {
    it('should allow a new team lead to create an ORS', function() {
      signout();
      browser.get('http://localhost:8081/authentication/signin');

      //Register new user
      element(by.css('a[href="/authentication/signup"]')).click();

      signup(newORSLeader);
      browser.sleep(500);

      // Go to Dashboard
      browser.get('http://localhost:8081/restoration-stations');
      browser.sleep(500);

      expect(element(by.id('single-team-name')).getText()).toEqual('Default');

      // Check disabled links
      // expect(element(by.cssContainingText('.disabled', 'invite members to join')).isDisplayed()).toBe(true);
      expect(element(by.cssContainingText('.disabled', 'Add members')).isDisplayed()).toBe(true);
      // expect(element(by.cssContainingText('.disabled', 'create one')).isDisplayed()).toBe(true);
      expect(element(by.cssContainingText('.disabled', 'See all')).isDisplayed()).toBe(true);
      expect(element(by.cssContainingText('.disabled', 'Create an expedition')).isDisplayed()).toBe(true);

      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(0);

      // Open register ORS modal
      element(by.id('register-an-ORS')).click();
      browser.sleep(500);

      fillInORS(station4, false);
      browser.sleep(1000);

      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(1);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station4.name + '\n' + station4.location.latitude + ', ' +
        station4.location.longitude + '\n' + station4.bodyOfWater + ' Active');
    });
  });
});
