'use strict';

var path = require('path'),
  EC = protractor.ExpectedConditions;

describe('Expedition E2E Tests', function() {

  var leader = {
    username: 'teacher',
    password: 'P@$$w0rd!!'
  };

  var member1 = {
    username: 'student1',
    password: 'P@$$w0rd!!'
  };

  var member2 = {
    username: 'student2',
    password: 'P@$$w0rd!!'
  };

  var team = {
    name: 'Test Team'
  };

  var station = {
    name: 'Test Station'
  };

  var expedition1 = {
    name: 'Test Expedition 1 - Auto Assign'
  };

  var siteCondition1 = {
    meteorologicalConditions: {
      airTemperatureC: 23,
      windSpeedMPH: 4,
      humidityPer: 23
    },
    tideConditions: {
      closestHighTide: new Date(),
      closestLowTide: new Date(),
      currentSpeedMPH: 3,
    },
    waterConditions: {
      garbage: {
        other: {
          description: 'wood'
        }
      },
      markedCombinedSewerOverflowPipes: {
        location: {
          latitude: 39.765,
          longitude: -76.234,
        }
      },
      unmarkedOutfallPipes: {
        location: {
          latitude: 39.765,
          longitude: -76.234,
        },
        approximateDiameterCM: 3
      }
    },
    landConditions: {
      garbage: {
        other: {
          description: 'wood'
        }
      },
      shorelineSurfaceCoverEstPer: {
        imperviousSurfacePer: 33,
        perviousSurfacePer: 33,
        vegetatedSurfacePer: 34
      }
    }
  };

  var protocol2 = {

  };

  var mobileTrap1 = {
    organismDetails: {
      notes: 'Test organism details'
    }
  };

  var mobileTrap2 = {
    organismDetails: {
      notes: 'Test organism details2'
    }
  };

  var protocol4 = {

  };

  var protocol5 = {

  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:8081/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  var signinAs = function(user) {
    //Make sure user is signed out first
    signout();
    //Sign in
    browser.get('http://localhost:8081/authentication/signin');
    // Enter UserName
    element(by.model('vm.credentials.username')).sendKeys(user.username);
    // Enter Password
    element(by.model('vm.credentials.password')).sendKeys(user.password);
    // Click Submit button
    element(by.id('signin')).click();
  };

  var uploadImage = function(id) {
    var fileToUpload = '../../../../scripts/test-images/logo.png';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    var imageUploader = element(by.id(id));
    var input = imageUploader.element(by.css('input[type="file"]'));
    input.sendKeys(absolutePath);
    browser.sleep(500);
  };

  var defaultMapCoordinates = function(target) {
    element(by.css('a[data-target="#'+target+'"]')).click();
    element(by.id('saveMapSelectModal-'+target)).click();
  };

  var fillOutMobileOrganismDetails = function(mobileOrganism) {
    var addButton = mobileOrganism.element(by.css('[ng-click="addOrganism(organism)"]'));
    addButton.getAttribute('organism-id').then(function(value) {
      // Get the id for the mobileOrganism
      var organismId = value;

      // Click the button to open the mobile organism details modal
      addButton.click();
      mobileOrganism.element(by.css('[ng-click="openOrganismDetails(organism)"]')).click();

      // Wait until the modal is open
      var modal = element(by.id('modal-organism-details-'+organismId));
      browser.wait(EC.visibilityOf(modal), 5000);

      // Add an image to the mobile organism details
      uploadImage('mobileTrapSketchPhoto-'+organismId); // Mobile Trap Organism Detail Image Upload
      // Add a description
      modal.element(by.model('organismDetails.notes')).sendKeys(mobileTrap1.organismDetails.notes);
      // Save the mobile organism details
      modal.element(by.buttonText('Save')).click();
      // Wait until the modal is closed and return
      browser.wait(EC.invisibilityOf(modal), 5000);
    });
  };

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
      expect(element.all(by.repeater('item in vm.memberLists.members')).count()).toEqual(2);
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

  describe('Team member 1 view Expedition', function () {
    it ('should allow team member 1 to click protocols 1, 3, & 5', function () {
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
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(false);
      firstLink.click();
    });

    it ('should allow team member 1 to view protocols 1, 3, & 5', function() {
      // Site Condition tab should be visible
      expect(element(by.partialLinkText('Site Conditions')).isDisplayed()).toBe(true);
      // Mobile Trap tab should be visible
      expect(element(by.partialLinkText('Mobile Trap')).isDisplayed()).toBe(true);
      // Water Quality tab should be visible
      expect(element(by.partialLinkText('Water Quality')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to fill out protocol 1', function() {
      element(by.partialLinkText('Site Conditions')).click();
      // Fill in values
      // Meteorological Conditions
      element(by.model('siteCondition.meteorologicalConditions.weatherConditions')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.meteorologicalConditions.airTemperatureC')).sendKeys(siteCondition1.meteorologicalConditions.airTemperatureC);
      element(by.model('siteCondition.meteorologicalConditions.windSpeedMPH')).sendKeys(siteCondition1.meteorologicalConditions.windSpeedMPH);
      element(by.model('siteCondition.meteorologicalConditions.windDirection')).all(by.tagName('option')).get(4).click();
      element(by.model('siteCondition.meteorologicalConditions.humidityPer')).sendKeys(siteCondition1.meteorologicalConditions.humidityPer);
      element(by.model('siteCondition.recentRainfall.rainedIn7Days')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.recentRainfall.rainedIn72Hours')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.recentRainfall.rainedIn24Hours')).all(by.tagName('option')).get(1).click();
      // Tide Conditions
      element(by.model('siteCondition.tideConditions.currentSpeedMPH')).sendKeys(siteCondition1.tideConditions.currentSpeedMPH);
      element(by.model('siteCondition.tideConditions.currentDirection')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.tideConditions.tidalCurrent')).all(by.tagName('option')).get(2).click();
      // Water Conditions
      uploadImage('water-condition-image-dropzone'); // Water Condition Image Upload
      element(by.model('siteCondition.waterConditions.waterColor')).all(by.tagName('option')).get(4).click();
      element(by.model('siteCondition.waterConditions.oilSheen')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.garbage.garbagePresent')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.garbage.hardPlastic')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.garbage.softPlastic')).all(by.tagName('option')).get(2).click();
      element(by.model('siteCondition.waterConditions.garbage.metal')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.waterConditions.garbage.paper')).all(by.tagName('option')).get(4).click();
      element(by.model('siteCondition.waterConditions.garbage.glass')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.garbage.organic')).all(by.tagName('option')).get(2).click();
      element(by.model('siteCondition.waterConditions.garbage.other.description')).sendKeys(siteCondition1.waterConditions.garbage.other.description);
      element(by.model('siteCondition.waterConditions.garbage.other.extent')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent')).all(by.tagName('option')).get(1).click();
      defaultMapCoordinates('modal-map-marked');
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough')).all(by.tagName('option')).get(3).click();
      //defaultMapCoordinates('modal-map-unmarked');
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM')).sendKeys(siteCondition1.waterConditions.unmarkedOutfallPipes.approximateDiameterCM);
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough')).all(by.tagName('option')).get(1).click();
      // Land Conditions
      uploadImage('land-condition-image-dropzone');
      element(by.model('siteCondition.landConditions.shoreLineType')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.landConditions.garbage.garbagePresent')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer')).sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer);
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer')).sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer);
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer')).sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer);
      element(by.model('siteCondition.landConditions.garbage.hardPlastic')).all(by.tagName('option')).get(4).click();
      element(by.model('siteCondition.landConditions.garbage.softPlastic')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.landConditions.garbage.metal')).all(by.tagName('option')).get(2).click();
      element(by.model('siteCondition.landConditions.garbage.paper')).all(by.tagName('option')).get(3).click();
      element(by.model('siteCondition.landConditions.garbage.glass')).all(by.tagName('option')).get(4).click();
      element(by.model('siteCondition.landConditions.garbage.organic')).all(by.tagName('option')).get(1).click();
      element(by.model('siteCondition.landConditions.garbage.other.description')).sendKeys(siteCondition1.landConditions.garbage.other.description);
      element(by.model('siteCondition.landConditions.garbage.other.extent')).all(by.tagName('option')).get(2).click();

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 2000);
      var protocol1Tab = element(by.id('protocol1tab'));
      expect(protocol1Tab.isPresent()).toBe(true);
      expect(protocol1Tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to fill out protocol 3', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol3tab')).click();
      browser.sleep(1000);
      browser.wait(EC.visibilityOf(element(by.repeater('organism in mobileOrganisms track by organism._id'))), 5000);

      // Fill in values
      var mobileOrganisms = element.all(by.repeater('organism in mobileOrganisms track by organism._id'));
      var organism1 = mobileOrganisms.get(0);
      var organism2 = mobileOrganisms.get(1);

      fillOutMobileOrganismDetails(organism1);
      fillOutMobileOrganismDetails(organism2);

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 5000);
      var protocol3tab = element(by.id('protocol3tab'));
      expect(protocol3tab.isPresent()).toBe(true);
      expect(protocol3tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
    });

  });

  // describe('Team member 2 view Expedition', function() {
  //   it ('should allow team member 2 to click protocols 2 & 4', function () {
  //     // Sign in as team member 1
  //     signinAs(member2);
  //     // Assert that it went to the correct opening page
  //     expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/restoration-stations');
  //     // Assert that there is only one expedition
  //     var expeditions = element.all(by.repeater('expedition in vm.expeditions'));
  //     expect(expeditions.count()).toEqual(1);
  //     // Click on that expedition
  //     expeditions.get(0).click();
  //     // Assert that only protocols 1, 3, & 5 are clickable
  //     expect(element(by.id('protocol1Link')).isDisplayed()).toBe(false);
  //     expect(element(by.id('protocol1View')).isDisplayed()).toBe(true);
  //     var firstLink = element(by.id('protocol2Link'));
  //     expect(firstLink).toBe(true);
  //     expect(element(by.id('protocol2View')).isDisplayed()).toBe(false);
  //     expect(element(by.id('protocol3Link')).isDisplayed()).toBe(false);
  //     expect(element(by.id('protocol3View')).isDisplayed()).toBe(true);
  //     expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
  //     expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
  //     expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
  //     expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
  //     firstLink.click();
  //   });
  //
  //   it ('should allow team member 2 to view protocols 2 & 4', function() {
  //     // Oyster Measurements tab should be visible
  //     var oysterMeasurementLink = element(by.partialLinkText('Oyster Measurements'));
  //     expect(oysterMeasurementLink.isDisplayed()).toBe(true);
  //     // Settlement Tiles tab should be visible
  //     var settlementTilesLink = element(by.partialLinkText('Settlement Tiles'));
  //     expect(settlementTilesLink.isDisplayed()).toBe(true);
  //   });
  // });
});
