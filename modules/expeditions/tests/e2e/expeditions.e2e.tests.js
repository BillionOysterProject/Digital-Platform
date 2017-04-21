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
  assertSiteConditionView = CommonSiteConditions.assertSiteConditionView,
  assertSiteConditionCompare = CommonSiteConditions.assertSiteConditionCompare,
  CommonOysterMeasurements = require('../../../protocol-oyster-measurements/tests/e2e/common-oyster-measurements.e2e.tests'),
  assertSubstrateMeasurements = CommonOysterMeasurements.assertSubstrateMeasurements,
  assertOysterMeasurements = CommonOysterMeasurements.assertOysterMeasurements,
  fillOutOysterMeasurements = CommonOysterMeasurements.fillOutOysterMeasurements,
  fillOutAllOysterMeasurements = CommonOysterMeasurements.fillOutAllOysterMeasurements,
  assertOysterMeasurementsView = CommonOysterMeasurements.assertOysterMeasurementsView,
  assertOysterMeasurementCompare = CommonOysterMeasurements.assertOysterMeasurementCompare,
  CommonMobileTraps = require('../../../protocol-mobile-traps/tests/e2e/common-mobile-traps.e2e.tests'),
  assertMobileOrganismDetails = CommonMobileTraps.assertMobileOrganismDetails,
  assertMobileTrap = CommonMobileTraps.assertMobileTrap,
  fillOutMobileOrganismDetails = CommonMobileTraps.fillOutMobileOrganismDetails,
  fillOutMobileTraps = CommonMobileTraps.fillOutMobileTraps,
  assertMobileTrapView = CommonMobileTraps.assertMobileTrapView,
  assertMobileTrapCompare = CommonMobileTraps.assertMobileTrapCompare,
  CommonSettlementTiles = require('../../../protocol-settlement-tiles/tests/e2e/common-settlement-tiles.e2e.tests'),
  assertSettlementTile = CommonSettlementTiles.assertSettlementTile,
  assertSettlementTiles = CommonSettlementTiles.assertSettlementTiles,
  fillOutSettlementTile = CommonSettlementTiles.fillOutSettlementTile,
  fillOutSettlementTiles = CommonSettlementTiles.fillOutSettlementTiles,
  assertSettlementTilesView = CommonSettlementTiles.assertSettlementTilesView,
  assertSettlementTileCompare = CommonSettlementTiles.assertSettlementTileCompare,
  CommonWaterQuality = require('../../../protocol-water-quality/tests/e2e/common-water-quality.e2e.tests'),
  assertWaterQuality = CommonWaterQuality.assertWaterQuality,
  fillOutWaterQualitySample = CommonWaterQuality.fillOutWaterQualitySample,
  fillOutWaterQuality = CommonWaterQuality.fillOutWaterQuality,
  assertWaterQualityView = CommonWaterQuality.assertWaterQualityView,
  assertWaterQualityCompare = CommonWaterQuality.assertWaterQualityCompare,
  EC = protractor.ExpectedConditions;

xdescribe('Expedition E2E Tests', function() {

  var leader = CommonUser.leader;
  var member1 = CommonUser.member1;
  var member2 = CommonUser.member2;
  var team = CommonUser.team;
  var organization = CommonUser.organization;
  var station = CommonUser.station;
  var station2 = CommonUser.station2;

  var expedition1 = CommonExpedition.expedition1;
  var siteCondition1 = CommonSiteConditions.siteCondition1;
  var oysterMeasurement1 = CommonOysterMeasurements.oysterMeasurement1;
  var mobileTrap1 = CommonMobileTraps.mobileTrap1;
  var mobileTrap2 = CommonMobileTraps.mobileTrap2;
  var settlementTiles1 = CommonSettlementTiles.settlementTiles1;
  var waterQuality1 = CommonWaterQuality.waterQuality1;
  var waterQuality2 = CommonWaterQuality.waterQuality2;

  var expedition2 = CommonExpedition.expedition2;
  var siteCondition2 = CommonSiteConditions.siteCondition2;
  var oysterMeasurement2 = CommonOysterMeasurements.oysterMeasurement2;
  var mobileTrap3 = CommonMobileTraps.mobileTrap3;
  var settlementTiles2 = CommonSettlementTiles.settlementTiles2;
  var waterQuality3 = CommonWaterQuality.waterQuality3;

  var expedition3 = CommonExpedition.expedition3;
  var siteCondition3 = CommonSiteConditions.siteCondition3;
  var oysterMeasurement3 = CommonOysterMeasurements.oysterMeasurement3;
  var mobileTrap4 = CommonMobileTraps.mobileTrap4;
  var settlementTiles3 = CommonSettlementTiles.settlementTiles3;
  var waterQuality4 = CommonWaterQuality.waterQuality4;

  var saveDraftWait = 450000;

//############################################################################//
//  TEAM MEMBER - VIEW PUBLISHED EXPEDITION
//############################################################################//
  describe('List/Search Expeditions Tests', function() {
    describe('Search Expeditions', function() {
      var startDate = element.all(by.model('vm.filter.startDate')).get(0);
      var endDate = element.all(by.model('vm.filter.endDate')).get(0);
      var searchField = element.all(by.model('vm.filter.searchString')).get(0);
      var stationFilter = element.all(by.model('vm.filter.stationObj')).get(0);
      var orgFilter = element.all(by.model('vm.filter.organizationObj')).get(0);
      var teamFilter = element.all(by.model('vm.filter.teamObj')).get(0);
      var teamLeadFilter = element.all(by.model('vm.filter.teamLeadObj')).get(0);

      it('should allow a team member to view expedition', function() {
        // Sign in as team member
        signinAs(member1);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to public expeditions
        element(by.id('pubexpeditions')).click();
        browser.sleep(500);

        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);
      });

      it('should allow a team member to filter by location', function() {
        stationFilter.clear().sendKeys(station2.name).click();

        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(1);

        stationFilter.clear().sendKeys('All').click();
      });

      it('should allow a team member to filter by organization', function() {
        orgFilter.clear().sendKeys(organization.name).click();

        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);

        orgFilter.clear().sendKeys('All').click();
      });

      it('should allow a team member to filter by team', function() {
        teamFilter.clear().sendKeys(team.name).click();

        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);

        teamFilter.clear().sendKeys('All').click();
      });

      it('should allow a team member to filter by team lead', function() {
        teamLeadFilter.clear().sendKeys(leader.name).click();

        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);

        teamLeadFilter.clear().sendKeys('All').click();
      });

      it('should allow a team member to search for blue mussel', function() {
        searchField.clear().sendKeys('blue mussel').click();

        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(1);

        searchField.clear().click();
      });
    });
  });

//############################################################################//
//  TEAM MEMBER - VIEW PUBLISHED EXPEDITION
//############################################################################//
  xdescribe('Compare Expeditions Tests', function() {
    describe('Compare Expeditions', function() {
      it('should allow a team member to view expedition', function() {
        // Sign in as team member
        signinAs(member1);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to published expeditions
        element(by.id('pubexpeditions')).click();
        browser.sleep(500);
        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);

        element(by.partialLinkText('Compare')).click();
        browser.wait(EC.visibilityOf(element(by.id('step1-header'))), 5000);
        browser.sleep(500);
        expect(element(by.id('step1-header')).getText()).toEqual('1. Refine the expeditions to compare');
      });

      it('should allow a team member to filter expeditions', function() {
        var teamLeadFilter = element.all(by.model('vm.filter.teamLeadObj')).get(1);
        expect(teamLeadFilter.isPresent()).toBe(true);
        teamLeadFilter.clear().sendKeys('tea').click();
        browser.sleep(100);

        expect(element(by.id('step2-header')).getText()).toEqual('2. Select parameters to compare from these 2 expeditions');
      });

      it('should allow a team member to filter parameters by protocol 1', function() {
        element(by.model('vm.parameters.protocol1all')).click();
        browser.sleep(100);

        expect(element(by.id('step3-header')).getText()).toEqual('3. Here\'s the results of these 17 data points across 2 expeditions Download all data');

        var assertHeaderCompare = function(index, expeditionValues, stationValues) {
          // Expedition Header
          var expeditionHeaderRow = element(by.id('expedition-compare-header')).all(by.tagName('td'));
          var header = expeditionHeaderRow.get(index);
          expect(header.getText()).toEqual(expeditionValues.name + '\n' + stationValues.name + ', ' +
            moment(expeditionValues.monitoringStartDate).format('MMMM D, YYYY'));
        };

        assertHeaderCompare(1, expedition3, station2);
        assertHeaderCompare(2, expedition2, station);

        assertSiteConditionCompare(1, siteCondition3);
        assertSiteConditionCompare(2, siteCondition2);

        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.model('vm.parameters.protocol1all')).click();
          browser.sleep(100);
        });
      });

      it('should allow a team member to filter parameters by protocol 2', function() {
        element(by.model('vm.parameters.protocol2all')).click();
        browser.sleep(100);

        expect(element(by.id('step3-header')).getText()).toEqual('3. Here\'s the results of these 5 data points across 2 expeditions Download all data');

        assertOysterMeasurementCompare(1, oysterMeasurement3);
        assertOysterMeasurementCompare(2, oysterMeasurement2);

        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.model('vm.parameters.protocol2all')).click();
          browser.sleep(100);
        });
      });

      it('should allow a team member to filter parameters by protocol 3', function() {
        element(by.model('vm.parameters.protocol3all')).click();
        browser.sleep(100);

        assertMobileTrapCompare(1, mobileTrap4);
        assertMobileTrapCompare(2, mobileTrap3);

        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.model('vm.parameters.protocol3all')).click();
          browser.sleep(100);
        });
      });

      it('should allow a team member to filter parameters by protocol 4', function() {
        element(by.model('vm.parameters.protocol4all')).click();
        browser.sleep(100);

        assertSettlementTileCompare(1, settlementTiles3);
        assertSettlementTileCompare(2, settlementTiles2);

        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.model('vm.parameters.protocol4all')).click();
          browser.sleep(100);
        });
      });

      it('should allow a team member to filter parameters by protocol 5', function() {
        element(by.model('vm.parameters.protocol5all')).click();
        browser.sleep(100);

        assertWaterQualityCompare(1, waterQuality4);
        assertWaterQualityCompare(2, waterQuality3);

        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.model('vm.parameters.protocol5all')).click();
          browser.sleep(100);
        });
      });
    });
  });

//############################################################################//
//  TEAM MEMBER - VIEW PUBLISHED EXPEDITION
//############################################################################//
  describe('View Expedition Tests', function() {
    describe('View Full Expedition', function() {
      it('should allow a team member to view expedition', function() {
        // Sign in as team member
        signinAs(member2);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to public expeditions
        element(by.id('pubexpeditions')).click();
        browser.sleep(500);

        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(2);
        // Click on that expedition
        expeditions.get(0).click();

        browser.wait(EC.visibilityOf(element(by.cssContainingText('.green', 'Published'))), 5000);
        browser.sleep(500);
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
      });

      it('should show protocol 1', function() {
        element(by.partialLinkText('Site Conditions')).click();

        assertSiteConditionView(siteCondition2, member1);
      });

      it('should show protocol 2', function() {
        element(by.partialLinkText('Oyster Measurements')).click();

        assertOysterMeasurementsView(oysterMeasurement2, station, member1);
      });

      it('should show protocol 3', function() {
        element(by.partialLinkText('Mobile Trap')).click();

        assertMobileTrapView({
          mobileTrap: [mobileTrap3]
        }, member1);
      });

      it('should show protocol 4', function() {
        element(by.partialLinkText('Settlement Tiles')).click();

        assertSettlementTilesView(settlementTiles2, member1);
      });

      it('should show protocol 5', function() {
        element(by.partialLinkText('Water Quality')).click();

        assertWaterQualityView({
          samples: [waterQuality3]
        }, member1);
      });
    });
  });

//############################################################################//
//  TEAM LEAD - CREATE EXPEDITION
//############################################################################//

  describe('Full Expedition Creation Tests', function() {
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
        expect(allStationOptions.count()).toEqual(3);
        var lastStationOption = allStationOptions.last();
        expect(lastStationOption.getText()).toEqual(station.name);
        element(by.cssContainingText('option', station.name)).click();
        // Test team members present
        expect(element.all(by.repeater('item in vm.memberLists.members')).count()).toEqual(3);
        // Click Auto Assign
        element(by.id('autoassign')).click();
        browser.sleep(1000);
        expect(element.all(by.repeater('item in vm.expedition.teamLists.siteCondition')).count()).toEqual(1);
        expect(element.all(by.repeater('item in vm.expedition.teamLists.oysterMeasurement')).count()).toEqual(1);
        expect(element.all(by.repeater('item in vm.expedition.teamLists.mobileTrap')).count()).toEqual(1);
        expect(element.all(by.repeater('item in vm.expedition.teamLists.settlementTiles')).count()).toEqual(1);
        expect(element.all(by.repeater('item in vm.expedition.teamLists.waterQuality')).count()).toEqual(1);
        // Click launch button
        element(by.id('launchexpedition')).click();
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/expeditions');
      });
    });

  //############################################################################//
  //  TEAM MEMBER 1 - VIEW EXPEDITION
  //############################################################################//

    xdescribe('Team member 1 fill out Expedition', function () {
      it ('should allow team member 1 to click protocols 1 & 4', function () {
        // Sign in as team member 1
        signinAs(member1);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);

        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(2);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        browser.wait(EC.presenceOf($('#protocol-1-form')), 5000);

        // Fill in values
        fillOutSiteConditions(siteCondition1);

        // Save draft
        element(by.buttonText('Save Draft')).click();

        // Wait until saving is done
        browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), saveDraftWait);
        var protocol1Tab = element(by.id('protocol1tab'));
        expect(protocol1Tab.isPresent()).toBe(true);
        expect(protocol1Tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

        assertSiteCondition();
        browser.sleep(1000);
      });

  //############################################################################//
  //  TEAM MEMBER 1 - SETTLEMENT TILES
  //############################################################################//

      it ('should allow team member 2 to fill out protocol 4', function() {
        element(by.partialLinkText('Settlement Tiles')).click();
        browser.wait(EC.presenceOf($('#protocol-4-form')), 5000);

        // browser.wait(EC.visibilityOf(element(by.repeater('tile in settlementTiles.settlementTiles'))), 5000);

        fillOutSettlementTiles();

        // Save draft
        element(by.buttonText('Save Draft')).click();
        // Wait until saving is done
        browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), saveDraftWait);
        var protocol4tab = element(by.id('protocol4tab'));
        expect(protocol4tab.isPresent()).toBe(true);
        expect(protocol4tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

        assertSettlementTiles();
        browser.sleep(1000);
      });


  //############################################################################//
  //  TEAM MEMBER 1 - SUBMIT PROTOCOLS 1 & 4
  //############################################################################//

      it ('should allow team member 1 to submit protocols 1 & 4', function() {
        // Submit
        element(by.buttonText('Submit')).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);

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

    xdescribe('Team lead fill out Expedition', function () {
      it ('should allow team lead to click protocol 1, 3, & 4', function () {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);

        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        browser.wait(EC.presenceOf($('#protocol-3-form')), 500);
        // browser.waitForAngular();
        // browser.sleep(2500);
        // browser.wait(EC.visibilityOf(element(by.repeater('organism in mobileOrganisms track by organism._id'))), 5000);

        fillOutMobileTraps();
        browser.sleep(1000);

        // Save draft
        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.buttonText('Save Draft')).click();

          // Wait until saving is done
          browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), saveDraftWait);
          var protocol3tab = element(by.id('protocol3tab'));
          expect(protocol3tab.isPresent()).toBe(true);
          expect(protocol3tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
          //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

          // Asserts
          assertMobileTrap();
          browser.sleep(1000);
        });
      });

  //############################################################################//
  //  TEAM LEAD - SUBMIT PROTOCOLS 3
  //############################################################################//

      it ('should allow team lead to submit protocols 1, 3, & 4', function() {
        // Submit
        element(by.buttonText('Submit')).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);

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

    xdescribe('Team member 2 fill out Expedition', function () {
      it ('should allow team member 2 to click protocols 2 & 5', function () {
        // Sign in as team member 2
        signinAs(member2);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(2);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        browser.wait(EC.presenceOf($('#protocol-2-form')), 5000);

        // browser.wait(EC.visibilityOf(element(by.cssContainingText('.blue', 'measuring growth and recording mortality of oysters'))), 5000);

        fillOutAllOysterMeasurements();
        // browser.sleep(100);

        // Save draft
        element(by.buttonText('Save Draft')).click();
        // Wait until saving is done
        browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), saveDraftWait);
        var protocol2tab = element(by.id('protocol2tab'));
        expect(protocol2tab.isPresent()).toBe(true);
        expect(protocol2tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

        assertOysterMeasurements();
        browser.sleep(1000);
      });

  //############################################################################//
  //  TEAM MEMBER 1 - WATER QUALITY
  //############################################################################//

      it ('should allow team member 2 to fill out protocol 5', function() {
        // Click on the Mobile Trap tab
        element(by.id('protocol5tab')).click();
        browser.wait(EC.presenceOf($('#protocol-5-form')), 5000);
        browser.executeScript('window.scrollTo(0,0);').then(function () {
          //browser.wait(EC.visibilityOf(element(by.repeater('sample in waterQuality.samples'))), 5000);

          fillOutWaterQuality();

          // Save draft
          element(by.buttonText('Save Draft')).click();
          // Wait until saving is done
          browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), saveDraftWait);
          var protocol5tab = element(by.id('protocol5tab'));
          expect(protocol5tab.isPresent()).toBe(true);
          expect(protocol5tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
          //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
          //expect(element(by.id('protocol3tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);

          assertWaterQuality();
          browser.sleep(1000);
        });
      });

  //############################################################################//
  //  TEAM MEMBER 2 - SUBMIT PROTOCOLS 2 & 5
  //############################################################################//

      it ('should allow team member 2 to submit protocols 2 & 5', function() {
        // Submit
        browser.executeScript('window.scrollTo(0,0);').then(function () {
          element(by.buttonText('Submit')).click();
          browser.wait(EC.presenceOf($('#expedition-view')), 5000);

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
    });

  //############################################################################//
  //  TEAM LEAD - RETURN EXPEDITION
  //############################################################################//

    xdescribe('Return Expedition', function() {
      it('should allow a team lead to return the protocols to the team members', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(2);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(2);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
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
        browser.wait(EC.presenceOf($('#expedition-protocol-form')), 5000);
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

    xdescribe('Publish Expedition', function() {
      it('should allow a team lead to publish the protocols', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);
        // browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);
        // Click to view the protocols in the expedition
        element(by.id('protocol2Link')).isDisplayed().click();
        browser.wait(EC.presenceOf($('#protocol-1-form')), 5000);
      });

      it ('should allow team lead to update a substrate baseline', function() {
        element(by.id('protocol2tab')).click();
        browser.wait(EC.visibilityOf(element(by.id('submergedDepth'))), 5000);

        var index = 4;
        var modal = element(by.id('modal-substrateshell'+index));
        var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];
        var baseline = station.baselines['substrateShell'+(index+1)];

        element(by.id('edit-measurements-'+index)).click();
        browser.wait(EC.visibilityOf(modal), 10000);

        modal.element(by.id('substrate-meta')).click();
        browser.wait(EC.presenceOf($('#edit-baseline')), 5000);
        modal.element(by.id('edit-baseline')).click();
        browser.wait(EC.visibilityOf(modal.element(by.id('source'))), 5000);
        //browser.pause();
        modal.element(by.id('source')).all(by.tagName('option')).get(measurementsDetails.source).click();
        if (measurementsDetails.otherSource) modal.element(by.model('baseline.otherSource')).sendKeys(measurementsDetails.otherSource);
        if (measurementsDetails.totalNumberOfLiveOystersAtBaseline) modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersAtBaseline);
        if (measurementsDetails.totalMassOfLiveOystersAtBaselineG) modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).clear().sendKeys(measurementsDetails.totalMassOfLiveOystersAtBaselineG);
        modal.element(by.buttonText('Save')).click();
        browser.wait(EC.invisibilityOf(modal), 5000);
        //browser.pause();

        element(by.id('edit-measurements-'+index)).click();
        browser.wait(EC.visibilityOf(modal), 10000);

        modal.element(by.id('substrate-meta')).click();
        browser.wait(EC.presenceOf($('#substrate-meta')), 5000);
        expect(modal.element(by.id('source-readonly')).getAttribute('value')).toEqual(measurementsDetails.sourceText);
        if (measurementsDetails.otherSource) expect(modal.element(by.model('baseline.otherSource')).getAttribute('value')).toEqual(measurementsDetails.otherSource);
        if (measurementsDetails.totalNumberOfLiveOystersAtBaseline) expect(modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersAtBaseline.toString());
        if (measurementsDetails.totalMassOfLiveOystersAtBaselineG) expect(modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).getAttribute('value')).toEqual(measurementsDetails.totalMassOfLiveOystersAtBaselineG.toString());
        modal.element(by.buttonText('Cancel')).click();
        browser.wait(EC.invisibilityOf(modal), 5000);
        browser.sleep(1000);
      });

      it ('should allow team lead to publish the expedition', function() {
        // Submit
        element(by.buttonText('Publish')).click();
        browser.wait(EC.visibilityOf(element(by.cssContainingText('.green', 'Published'))), 5000);

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
      });
    });

  //############################################################################//
  //  TEAM LEAD - UNPUBLISH EXPEDITION
  //############################################################################//

    xdescribe('Unpublish Expedition', function() {
      it('should allow a team lead to unpublish the protocols', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);

        browser.wait(EC.visibilityOf(element(by.cssContainingText('.green', 'Published'))), 5000);
        browser.wait(EC.visibilityOf(element(by.cssContainingText('.btn-danger', 'Unpublish'))), 5000);
        // Unpublish the expedition
        element(by.cssContainingText('.btn-danger', 'Unpublish')).click();

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

    xdescribe('Re-publish Expedition', function() {
      it('should allow a team lead to re-publish the protocols', function() {
        // Sign in as team lead
        signinAs(leader);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/lessons');
        // Go to expeditions
        browser.get('http://localhost:8081/expeditions');
        browser.wait(EC.presenceOf($('#list-expeditions')), 5000);
        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.myExpeditions'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();
        browser.wait(EC.presenceOf($('#expedition-view')), 5000);

        browser.wait(EC.visibilityOf(element(by.cssContainingText('.gray', 'Protocols'))), 5000);
        // Click to view the protocols in the expedition
        element(by.id('protocol1Link')).isDisplayed().click();
      });

      it ('should allow team lead to publish the expedition', function() {
        // Submit
        element(by.buttonText('Publish')).click();
        browser.wait(EC.visibilityOf(element(by.cssContainingText('.green', 'Published'))), 5000);

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
      });
    });

  //############################################################################//
  //  TEAM MEMBER - VIEW EXPEDITION
  //############################################################################//

    xdescribe('View Expedition', function() {
      it('should allow a team member to view expedition', function() {
        // Sign in as team member
        signinAs(member1);
        // Assert that it went to the correct opening page
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration');
        // Go to public expeditions
        element(by.id('pubexpeditions')).click();

        // Assert that there is only one expedition
        var expeditions = element.all(by.repeater('expedition in vm.published'));
        expect(expeditions.count()).toEqual(3);
        // Click on that expedition
        expeditions.get(0).click();

        browser.wait(EC.visibilityOf(element(by.cssContainingText('.green', 'Published'))), 5000);

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
      });
    });
  });
});
