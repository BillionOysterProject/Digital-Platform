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
  CommonProfiles = require('../../../profiles/tests/e2e/common-profiles.e2e.tests'),
  assertORSProfile = CommonProfiles.assertORSProfile,
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

  var station1 = CommonProfiles.station1;
  var station2 = CommonProfiles.station2;
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
    shoreLine: 2,
    shoreLineText: 'Fixed Pier',
    status: 1,
    statusText: 'Active',
    notes: 'Initial notes',
    siteCoordinator: 3,
    siteCoordinatorName: 'Other',
    otherSiteCoordinator: {
      displayName: 'Other Coordinator',
      email: 'otherCoordinator@localhost.com'
    },
    propertyOwner: 3,
    propertyOwnerName: 'Other',
    otherPropertyOwner: {
      name: 'Other Owner',
      email: 'otherOwner@localhost.com'
    }
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
    shoreLine: 1,
    shoreLineText: 'Fixed Pier',
    status: 1,
    statusText: 'Damaged',
    notes: 'Updated notes',
    siteCoordinator: 0,
    siteCoordinatorName: 'Site1 Coordinator',
    propertyOwner: 0,
    propertyOwnerName: 'Property1'
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
    shoreLine: 3,
    shoreLineText: 'Floating Dock',
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
    element(by.model('station.shoreLineType')).all(by.tagName('option')).get(values.shoreLine).click();
    element(by.model('station.bodyOfWater')).clear().sendKeys(values.bodyOfWater).click();
    element(by.model('station.boroughCounty')).clear().sendKeys(values.boroughCounty).click();
    element(by.model('station.notes')).clear().sendKeys(values.notes).click();
    element(by.model('vm.selectedPlace')).clear().sendKeys(values.location.address);
    element(by.model('vm.selectedPlace')).sendKeys(protractor.Key.ENTER);
    element(by.model('station.siteCoordinator._id')).all(by.tagName('option')).get(values.siteCoordinator).click();
    if (values.siteCoordinatorName === 'Other') {
      element(by.model('station.siteCoordinator.displayName')).clear().sendKeys(values.otherSiteCoordinator.displayName).click();
      element(by.model('station.siteCoordinator.email')).clear().sendKeys(values.otherSiteCoordinator.email).click();
    }
    element(by.model('station.propertyOwner._id')).all(by.tagName('option')).get(values.propertyOwner).click();
    if (values.propertyOwnerName === 'Other') {
      element(by.model('station.propertyOwner.name')).clear().sendKeys(values.otherPropertyOwner.name).click();
      element(by.model('station.propertyOwner.email')).clear().sendKeys(values.otherPropertyOwner.email).click();
    }
    browser.sleep(500);
    uploadImage('ors-image-dropzone');
    browser.sleep(500);
    element(by.buttonText((isUpdate) ? 'Update' : 'Register')).click();
  };

  describe('ORS CRUD Tests', function() {
    it('should allow team lead to create an ORS', function() {
      //Sign in as leader
      signinAs(leader);
      //Assert that it went to correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');

      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(2);

      // Open register ORS modal
      element(by.id('register-an-ORS')).click();
      browser.sleep(500);

      fillInORS(station3, false);
      browser.sleep(2000);

      browser.get('http://localhost:8081/restoration');
      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3.name + '\n' + station3.bodyOfWater + '\n' +
        'by ' + leader.displayName + ' from ' + organization.name + ' Active');
    });
    it('should allow team lead to edit an ORS', function() {
      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3.name + '\n' + station3.bodyOfWater + '\n' +
        'by ' + leader.displayName + ' from ' + organization.name + ' ' + station3.statusText);

      // Open edit ORS modal
      ors.click();
      browser.sleep(500);

      assertORSProfile(station3, leader, organization, false, true);

      element(by.css('a[ng-click="openOrsForm()"]')).click();
      browser.sleep(500);

      fillInORS(station3update, true);
      browser.sleep(1000);

      element(by.id('ors-view-close')).click();

      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      ors = orses.get(0);
      expect(ors.getText()).toEqual(station3update.name + '\n' + station3update.bodyOfWater + '\n' +
        'by ' + leader.displayName + ' from ' + organization.name + ' ' + station3update.statusText);
    });
    it('should allow team lead to delete an ORS', function() {
      var orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(3);
      var ors = orses.get(0);
      expect(ors.getText()).toEqual(station3update.name + '\n' + station3update.bodyOfWater + '\n' +
        'by ' + leader.displayName + ' from ' + organization.name + ' ' + station3update.statusText);

      // Open edit ORS modal
      ors.click();
      browser.sleep(500);

      element(by.css('a[ng-click="openOrsForm()"]')).click();
      browser.sleep(500);

      element(by.buttonText('Delete')).click();
      orses = element.all(by.repeater('station in vm.stations'));
      expect(orses.count()).toEqual(2);
    });
  });
  it('should allow team lead to view an ORS from their org', function() {
    var orses = element.all(by.repeater('station in vm.stations'));
    expect(orses.count()).toEqual(2);
    var ors = orses.get(0);
    expect(ors.getText()).toEqual(station2.name + '\n' + station2.bodyOfWater + '\n' +
      'by ' + leader.displayName + ' from ' + organization.name + ' ' + station2.statusText);

    // Open edit ORS modal
    ors.click();
    browser.sleep(500);

    assertORSProfile(station2, leader, organization, false, true);

    element(by.id('ors-view-close')).click();
  });
});
