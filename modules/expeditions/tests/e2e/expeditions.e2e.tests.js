'use strict';

var path = require('path'),
  moment = require('moment'),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  signinAs = CommonUser.signinAs,
  CommonExpedition = require('./common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  CommonSiteConditions = require('../../../protocol-site-conditions/tests/e2e/common-site-conditions.e2e.tests'),
  assertSiteCondition = CommonSiteConditions.assertSiteCondition,
  fillOutSiteConditions = CommonSiteConditions.fillOutSiteConditions,
  CommonOysterMeasurements = require('../../../protocol-oyster-measurements/tests/e2e/common-oyster-measurements.e2e.tests'),
  assertSubstrateMeasurements = CommonOysterMeasurements.assertSubstrateMeasurements,
  assertOysterMeasurements = CommonOysterMeasurements.assertOysterMeasurements,
  fillOutOysterMeasurements = CommonOysterMeasurements.fillOutOysterMeasurements,
  fillOutAllOysterMeasurements = CommonOysterMeasurements.fillOutAllOysterMeasurements,
  CommonMobileTraps = require('../../../protocol-mobile-traps/tests/e2e/common-mobile-traps.e2e.tests'),
  assertMobileOrganismDetails = CommonMobileTraps.assertMobileOrganismDetails,
  assertMobileTrap = CommonMobileTraps.assertMobileTrap,
  fillOutMobileOrganismDetails = CommonMobileTraps.fillOutMobileOrganismDetails,
  fillOutMobileTraps = CommonMobileTraps.fillOutMobileTraps,
  CommonSettlementTiles = require('../../../protocol-settlement-tiles/tests/e2e/common-settlement-tiles.e2e.tests'),
  assertSettlementTile = CommonSettlementTiles.assertSettlementTile,
  assertSettlementTiles = CommonSettlementTiles.assertSettlementTiles,
  fillOutSettlementTile = CommonSettlementTiles.fillOutSettlementTile,
  fillOutSettlementTiles = CommonSettlementTiles.fillOutSettlementTiles,
  CommonWaterQuality = require('../../../protocol-water-quality/tests/e2e/common-water-quality.e2e.tests'),
  assertWaterQuality = CommonWaterQuality.assertWaterQuality,
  fillOutWaterQualitySample = CommonWaterQuality.fillOutWaterQualitySample,
  fillOutWaterQuality = CommonWaterQuality.fillOutWaterQuality,
  EC = protractor.ExpectedConditions;

describe('Expedition E2E Tests', function() {

  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var team = CommonUser.team;
  var station = CommonUser.station;
  var expedition1 = CommonUser.expedition1;
  var siteCondition1 = CommonSiteConditions.siteCondition1;
  var oysterMeasurement1 = CommonOysterMeasurements.oysterMeasurement1;
  var mobileTrap1 = CommonMobileTraps.mobileTrap1;
  var mobileTrap2 = CommonMobileTraps.mobileTrap2;
  var settlementTiles1 = CommonSettlementTiles.settlementTiles1;
  var waterQuality1 = CommonWaterQuality.waterQuality1;
  var waterQuality2 = CommonWaterQuality.waterQuality2;

//############################################################################//
//  TEAM LEAD - CREATE EXPEDITION
//############################################################################//

  describe('Create Expedition', function() {
    it('should create an expedition using auto-assign', function() {
      //Sign in as team leader
      signinAs(leader);
      //Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to Create Expedition
      browser.get('http://localhost:8081/expeditions/create');
      // Set expedition name
      element(by.model('vm.expedition.name')).sendKeys(expedition1.name);
      // Set a team
      var allTeamOptions = element.all(by.options('team._id as team.name for team in vm.teams'));
      expect(allTeamOptions.count()).toEqual(1);
      var firstTeamOption = allTeamOptions.first();
      expect(firstTeamOption.getText()).toEqual(team.name);
      element(by.cssContainingText('option', team.name)).click();
      // Set a station
      var allStationOptions = element.all(by.options('station._id as station.name for station in vm.stations'));
      expect(allStationOptions.count()).toEqual(2);
      var lastStationOption = allStationOptions.last();
      expect(lastStationOption.getText()).toEqual(station.name);
      element(by.cssContainingText('option', station.name)).click();
      // Test team members present
      expect(element.all(by.repeater('item in vm.memberLists.members')).count()).toEqual(3);
      // Click Auto Assign
      element(by.id('autoassign')).click();
      expect(element.all(by.repeater('item in vm.expedition.teamLists.siteCondition')).count()).toEqual(1);
      expect(element.all(by.repeater('item in vm.expedition.teamLists.oysterMeasurement')).count()).toEqual(1);
      expect(element.all(by.repeater('item in vm.expedition.teamLists.mobileTrap')).count()).toEqual(1);
      expect(element.all(by.repeater('item in vm.expedition.teamLists.settlementTiles')).count()).toEqual(1);
      expect(element.all(by.repeater('item in vm.expedition.teamLists.waterQuality')).count()).toEqual(1);
      // Click launch button
      element(by.id('launchexpedition')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/expeditions');
    });
  });

//############################################################################//
//  TEAM MEMBER 1 - VIEW EXPEDITION
//############################################################################//

  describe('Team member 1 fill out Expedition', function () {
    it ('should allow team member 1 to click protocols 1 & 4', function () {
      // Sign in as team member 1
      signinAs(member1);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 1, 3, & 5 are clickable
      var firstLink = element(by.id('protocol1Link')).isDisplayed();
      expect(firstLink).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
      firstLink.click();
    });

    it ('should allow team member 1 to view protocols 1 & 4', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
    });

//############################################################################//
//  TEAM MEMBER 1 - SITE CONDITION
//############################################################################//

    it ('should allow team member 1 to fill out protocol 1', function() {
      element(by.partialLinkText('Site Conditions')).click();
      browser.sleep(1000);

      // Fill in values
      fillOutSiteConditions(siteCondition1);

      // Save draft
      element(by.buttonText('Save Draft')).click();

      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 60000);
      var protocol1Tab = element(by.id('protocol1tab'));
      expect(protocol1Tab.isPresent()).toBe(true);
      expect(protocol1Tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

      assertSiteCondition();
      browser.sleep(500);
    });

//############################################################################//
//  TEAM MEMBER 1 - SETTLEMENT TILES
//############################################################################//

    it ('should allow team member 2 to fill out protocol 4', function() {
      element(by.partialLinkText('Settlement Tiles')).click();
      browser.sleep(1000);

      browser.wait(EC.visibilityOf(element(by.repeater('tile in settlementTiles.settlementTiles'))), 5000);

      fillOutSettlementTiles();

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 60000);
      var protocol4tab = element(by.id('protocol4tab'));
      expect(protocol4tab.isPresent()).toBe(true);
      expect(protocol4tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

      assertSettlementTiles();
      browser.sleep(500);
    });


//############################################################################//
//  TEAM MEMBER 1 - SUBMIT PROTOCOLS 1 & 4
//############################################################################//

    it ('should allow team member 1 to submit protocols 1 & 4', function() {
      // Submit
      element(by.buttonText('Submit')).click();

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
    });
  });

//############################################################################//
//  TEAM LEAD - VIEW EXPEDITION
//############################################################################//

  describe('Team lead fill out Expedition', function () {
    it ('should allow team lead to click protocol 1, 3, & 4', function () {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 2 & 4 are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      var firstLink = element(by.id('protocol3Link')).isDisplayed();
      expect(firstLink.isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
      firstLink.click();
    });

    it ('should allow team lead to view protocols 1, 3, & 4', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Mobile Trap tab should be visible
      expect(element(by.partialLinkText('Mobile Trap')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
    });

//############################################################################//
//  TEAM LEAD - MOBILE TRAP
//############################################################################//

    it ('should allow team lead to fill out protocol 3', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol3tab')).click();
      browser.waitForAngular();
      browser.sleep(2500);
      browser.wait(EC.visibilityOf(element(by.repeater('organism in mobileOrganisms track by organism._id'))), 5000);

      fillOutMobileTraps();

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 10000);
      var protocol3tab = element(by.id('protocol3tab'));
      expect(protocol3tab.isPresent()).toBe(true);
      expect(protocol3tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

      // Asserts
      assertMobileTrap();
      browser.sleep(500);
    });

//############################################################################//
//  TEAM LEAD - SUBMIT PROTOCOLS 3
//############################################################################//

    it ('should allow team lead to submit protocols 1, 3, & 4', function() {
      // Submit
      element(by.buttonText('Submit')).click();

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
    });
  });

//############################################################################//
//  TEAM MEMBER 2 - VIEW EXPEDITION
//############################################################################//

  describe('Team member 2 fill out Expedition', function () {
    it ('should allow team member 2 to click protocols 2 & 5', function () {
      // Sign in as team member 2
      signinAs(member2);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 2 & 4 are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      var firstLink = element(by.id('protocol2Link')).isDisplayed();
      expect(firstLink.isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(false);
      firstLink.click();
    });

    it ('should allow team member 2 to view protocols 2 & 5', function() {
      // Oyster Measurements tab should be visible
      expect(element(by.partialLinkText('Oyster Measurements')).isDisplayed()).toBe(true);
      // Water Quality tab should be visible
      expect(element(by.partialLinkText('Water Quality')).isDisplayed()).toBe(true);
    });

//############################################################################//
//  TEAM MEMBER 2 - OYSTER MEASUREMENT
//############################################################################//

    it ('should allow team member 2 to fill out protocol 2', function() {
      element(by.partialLinkText('Oyster Measurements')).click();
      browser.sleep(1000);

      browser.wait(EC.visibilityOf(element(by.cssContainingText('.blue', 'measuring growth and recording mortality of oysters'))), 5000);

      fillOutAllOysterMeasurements();

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 60000);
      var protocol2tab = element(by.id('protocol2tab'));
      expect(protocol2tab.isPresent()).toBe(true);
      expect(protocol2tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

      assertOysterMeasurements();
      browser.sleep(500);
    });

//############################################################################//
//  TEAM MEMBER 1 - WATER QUALITY
//############################################################################//

    it ('should allow team member 1 to fill out protocol 5', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol5tab')).click();
      browser.sleep(1000);
      browser.wait(EC.visibilityOf(element(by.repeater('sample in waterQuality.samples'))), 5000);

      fillOutWaterQuality();

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 5000);
      var protocol5tab = element(by.id('protocol5tab'));
      expect(protocol5tab.isPresent()).toBe(true);
      expect(protocol5tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol3tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

      assertWaterQuality();
      browser.sleep(500);
    });

//############################################################################//
//  TEAM MEMBER 2 - SUBMIT PROTOCOLS 2 & 5
//############################################################################//

    it ('should allow team member 2 to submit protocols 2 & 5', function() {
      // Submit
      browser.executeScript('window.scrollTo(0,0);').then(function () {
        element(by.buttonText('Submit')).click();
      });

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
    });
  });

//############################################################################//
//  TEAM LEAD - RETURN EXPEDITION
//############################################################################//

  describe('Return Expedition', function() {
    it('should allow a team lead to return the protocols to the team members', function() {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that all protocols are clickable
      var firstLink = element(by.id('protocol1Link')).isDisplayed();
      expect(firstLink).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(false);
      firstLink.click();
    });

    // var assertAll = function() {
    //   element(by.partialLinkText('Site Conditions')).click();
    //   browser.sleep(1000);
    //   assertSiteCondition();
    //
    //   element(by.partialLinkText('Oyster Measurements')).click();
    //   browser.sleep(1000);
    //   assertOysterMeasurements();
    //
    //   element(by.id('protocol3tab')).click();
    //   // browser.waitForAngular();
    //   browser.sleep(2000);
    //   assertMobileTrap();
    //
    //   element(by.partialLinkText('Settlement Tiles')).click();
    //   browser.sleep(1000);
    //   assertSettlementTiles();
    //
    //   element(by.id('protocol5tab')).click();
    //   browser.sleep(1000);
    //   assertWaterQuality();
    // };

    it ('should allow team lead to view all protocols', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Oyster Measurements tab should be visible
      expect(element(by.partialLinkText('Oyster Measurements')).isDisplayed()).toBe(true);
      // Mobile Trap tab should be visible
      expect(element(by.partialLinkText('Mobile Trap')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
      // Water Quality tab should be visible
      expect(element(by.partialLinkText('Water Quality')).isDisplayed()).toBe(true);
      // // Assert that all of the protocols are still filled out
      // assertAll();
    });

    it ('should allow team lead to return the expedition', function() {
      // Submit
      element(by.buttonText('Return')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      // Assert that all protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1View')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
    });

//############################################################################//
//  TEAM MEMBER 2 - RESUBMIT EXPEDITION
//############################################################################//

    it ('should allow team member 1 to click on protocols 1 & 4', function() {
      // Sign in as team member 1
      signinAs(member1);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 1, 3, & 5 are clickable
      var firstLink = element(by.id('protocol1Link')).isDisplayed();
      expect(firstLink).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
      firstLink.click();
    });

    it ('should allow team member 1 to view protocols 1 & 4', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to resubmit protocols 1 & 4', function() {
      // Submit
      element(by.id('submit-exp-returned')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
    });

//############################################################################//
//  TEAM LEAD - RESUBMIT EXPEDITION
//############################################################################//

    it ('should allow team lead to click on protocols 1, 3, & 4', function() {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 2 & 4 are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      var firstLink = element(by.id('protocol3Link')).isDisplayed();
      expect(firstLink.isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
      firstLink.click();
    });

    it ('should allow team lead to view protocols 1, 3, & 4', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Mobile Trap tab should be visible
      expect(element(by.partialLinkText('Mobile Trap')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
    });

    it ('should allow team lead to resubmit protocols 1, 3, & 4', function() {
      // Submit
      element(by.id('submit-exp-returned')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
    });


//############################################################################//
//  TEAM MEMBER 2 - RESUBMIT EXPEDITION
//############################################################################//

    it ('should allow team member 2 to click on protocols 2 & 5', function() {
      // Sign in as team member 2
      signinAs(member2);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();
      // Assert that only protocols 2 & 4 are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      var firstLink = element(by.id('protocol2Link')).isDisplayed();
      expect(firstLink.isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(false);
      firstLink.click();
    });

    it ('should allow team member 2 to view protocols 2 & 5', function() {
      // Oyster Measurements tab should be visible
      expect(element(by.partialLinkText('Oyster Measurements')).isDisplayed()).toBe(true);
      // Water Quality tab should be visible
      expect(element(by.partialLinkText('Water Quality')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 2 to resubmit protocols 2 & 5', function() {
      // Submit
      element(by.id('submit-exp-returned')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      // Assert that no protocols are clickable
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);

      expect(element(by.id('protocol1View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
    });
  });

//############################################################################//
//  TEAM LEAD - PUBLISH EXPEDITION
//############################################################################//

  describe('Publish Expedition', function() {
    it('should allow a team lead to publish the protocols', function() {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();

      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);
      // Click to view the protocols in the expedition
      element(by.id('protocol1Link')).isDisplayed().click();
    });

    it ('should allow team lead to publish the expedition', function() {
      // Submit
      element(by.buttonText('Publish')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
    });
  });

//############################################################################//
//  TEAM LEAD - UNPUBLISH EXPEDITION
//############################################################################//

  describe('Unpublish Expedition', function() {
    it('should allow a team lead to unpublish the protocols', function() {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();

      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);
      // Click to view the protocols in the expedition
      element(by.id('protocol1Link')).isDisplayed().click();
    });

    it ('should allow team lead to unpublish the expedition', function() {
      // Submit
      element(by.buttonText('Unpublish')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
    });
  });

//############################################################################//
//  TEAM LEAD - RE-PUBLISH EXPEDITION
//############################################################################//

  describe('Re-publish Expedition', function() {
    it('should allow a team lead to re-publish the protocols', function() {
      // Sign in as team lead
      signinAs(leader);
      // Assert that it went to the correct opening page
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
      // Go to expeditions
      browser.get('http://localhost:8081/expeditions');
      // Assert that there is only one expedition
      var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
      expect(expeditions.count()).toEqual(1);
      // Click on that expedition
      expeditions.get(0).click();

      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);
      // Click to view the protocols in the expedition
      element(by.id('protocol1Link')).isDisplayed().click();
    });

    it ('should allow team lead to publish the expedition', function() {
      // Submit
      element(by.buttonText('Publish')).click();
      browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).element(by.cssContainingText('.label-success', 'Published')).isDisplayed()).toBe(true);
    });
  });
});
