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

  var oysterMeasurement1 = {
    depthOfOysterCage: {
      submergedDepthofCageM: 5
    },
    conditionOfOysterCage: {
      notesOnDamageToCage: 'Test description of damage'
    },
    measuringOysterGrowth: {
      substrateShells: [{
        source: 'sourceA',
        totalNumberOfLiveOystersOnShell: 0,
        notes: 'Test notes 1',
        measurements: [{
        }]
      }, {
        source: 'sourceB',
        totalNumberOfLiveOystersOnShell: 1,
        notes: 'Test notes 2',
        measurements: [{
          sizeOfLiveOysterMM: 11.1
        }]
      }, {
        source: 'sourceC',
        totalNumberOfLiveOystersOnShell: 2,
        notes: 'Test notes 3',
        measurements: [{
          sizeOfLiveOysterMM: 23.1
        }, {
          sizeOfLiveOysterMM: 21.0
        }]
      }, {
        source: 'sourceD',
        totalNumberOfLiveOystersOnShell: 3,
        notes: 'Test notes 3',
        measurements: [{
          sizeOfLiveOysterMM: 32.1
        }, {
          sizeOfLiveOysterMM: 33.1
        }, {
          sizeOfLiveOysterMM: 38.2
        }]
      }, {
        source: 'sourceE',
        totalNumberOfLiveOystersOnShell: 4,
        notes: 'Test notes 4',
        measurements: [{
          sizeOfLiveOysterMM: 43.1
        }, {
          sizeOfLiveOysterMM: 40.1
        }, {
          sizeOfLiveOysterMM: 47.3
        }, {
          sizeOfLiveOysterMM: 44.2
        }]
      }, {
        source: 'sourceF',
        totalNumberOfLiveOystersOnShell: 5,
        notes: 'Test notes 5',
        measurements: [{
          sizeOfLiveOysterMM: 53.2
        }, {
          sizeOfLiveOysterMM: 52.1
        }, {
          sizeOfLiveOysterMM: 55.2
        }, {
          sizeOfLiveOysterMM: 58.4
        }, {
          sizeOfLiveOysterMM: 57.2
        }]
      }, {
        source: 'sourceG',
        totalNumberOfLiveOystersOnShell: 4,
        notes: 'Test notes 6',
        measurements: [{
          sizeOfLiveOysterMM: 65.2
        }, {
          sizeOfLiveOysterMM: 66.3
        }, {
          sizeOfLiveOysterMM: 62.1
        }, {
          sizeOfLiveOysterMM: 67.4
        }]
      }, {
        source: 'sourceH',
        totalNumberOfLiveOystersOnShell: 3,
        notes: 'Test notes 7',
        measurements: [{
          sizeOfLiveOysterMM: 77.3
        }, {
          sizeOfLiveOysterMM: 74.2
        }, {
          sizeOfLiveOysterMM: 72.1
        }]
      }, {
        source: 'sourceI',
        totalNumberOfLiveOystersOnShell: 2,
        notes: 'Test notes 8',
        measurements: [{
          sizeOfLiveOysterMM: 88.3
        }, {
          sizeOfLiveOysterMM: 84.3
        }]
      }, {
        source: 'sourceJ',
        totalNumberOfLiveOystersOnShell: 1,
        notes: 'Test notes 9',
        measurements: [{
          sizeOfLiveOysterMM: 93.2
        }]
      }, {
        source: 'sourceK',
        totalNumberOfLiveOystersOnShell: 0,
        notes: 'Test notes 2',
        measurements: [{
        }]
      }]
    }
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

  var waterQuality1 = {
    depthOfWaterSampleM: 5,
    waterTemperature: {
      results: [11.2, 13.2, 12.7],
      average: '12.37'
    },
    dissolvedOxygen: {
      results: [23.8, 21.0, 25.3],
      average: '23.37'
    },
    salinity: {
      results: [36.1, 33.6, 30.6],
      average: '33.43'
    },
    pH: {
      results: [44.0, 41.3, 42.7],
      average: '42.67'
    },
    turbidity: {
      results: [55.3, 51.1, 53.8],
      average: '53.4'
    },
    ammonia: {
      results: [61.4, 63.3, 67.5],
      average: '64.07'
    },
    nitrates: {
      results: [73.0, 72.6, 73.8],
      average: '73.13'
    },
    others: [{
      other1: {
        label: 'other1',
        method: 'method1',
        units: 'unit1',
        results: [88.5, 86.7, 84.9],
        average: '86.7'
      }
    }]
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
    browser.sleep(500);
  };

  var fillOutMobileOrganismDetails = function(mobileOrganism, details) {
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
      modal.element(by.model('organismDetails.notes')).sendKeys(details.organismDetails.notes);
      // Save the mobile organism details
      modal.element(by.buttonText('Save')).click();
      // Wait until the modal is closed and return
      browser.wait(EC.invisibilityOf(modal), 5000);
    });
  };

  var fillOutWaterQualitySample = function(sample, index, measurements) {
    sample.element(by.model('sample.depthOfWaterSampleM')).sendKeys(measurements.depthOfWaterSampleM);
    defaultMapCoordinates('modal-map-sample'+index);
    // Water Temperature
    sample.element(by.name('waterTemperatureMethod')).all(by.tagName('option')).get(2).click();
    sample.element(by.name('waterTemperatureUnits')).all(by.tagName('option')).get(2).click();
    sample.element(by.name('waterTemperatureResult1')).sendKeys(measurements.waterTemperature.results[0]);
    sample.element(by.name('waterTemperatureResult2')).sendKeys(measurements.waterTemperature.results[1]);
    sample.element(by.name('waterTemperatureResult3')).sendKeys(measurements.waterTemperature.results[2]);
    sample.element(by.name('waterTemperatureAverage')).sendKeys();
    sample.element(by.name('waterTemperatureAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.waterTemperature.average);
    });
    // Dissolved Oxygen
    sample.element(by.name('dissolvedOxygenMethod')).all(by.tagName('option')).get(3).click();
    sample.element(by.name('dissolvedOxygenUnits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('dissolvedOxygenResult1')).sendKeys(measurements.dissolvedOxygen.results[0]);
    sample.element(by.name('dissolvedOxygenResult2')).sendKeys(measurements.dissolvedOxygen.results[1]);
    sample.element(by.name('dissolvedOxygenResult3')).sendKeys(measurements.dissolvedOxygen.results[2]);
    sample.element(by.name('dissolvedOxygenAverage')).sendKeys();
    sample.element(by.name('dissolvedOxygenAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.dissolvedOxygen.average);
    });
    // Salinity
    sample.element(by.name('salinityMethod')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('salinityUnits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('salinityResult1')).sendKeys(measurements.salinity.results[0]);
    sample.element(by.name('salinityResult2')).sendKeys(measurements.salinity.results[1]);
    sample.element(by.name('salinityResult3')).sendKeys(measurements.salinity.results[2]);
    sample.element(by.name('salinityAverage')).sendKeys();
    sample.element(by.name('salinityAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.salinity.average);
    });
    // pH
    sample.element(by.name('pHmethod')).all(by.tagName('option')).get(2).click();
    sample.element(by.name('pHunits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('pHresult1')).sendKeys(measurements.pH.results[0]);
    sample.element(by.name('pHresult2')).sendKeys(measurements.pH.results[1]);
    sample.element(by.name('pHresult3')).sendKeys(measurements.pH.results[2]);
    sample.element(by.name('pHaverage')).sendKeys();
    sample.element(by.name('pHaverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.pH.average);
    });
    // Turbidity
    sample.element(by.name('turbidityMethod')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('turbidityUnits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('turbidityResult1')).sendKeys(measurements.turbidity.results[0]);
    sample.element(by.name('turbidityResult2')).sendKeys(measurements.turbidity.results[1]);
    sample.element(by.name('turbidityResult3')).sendKeys(measurements.turbidity.results[2]);
    sample.element(by.name('turbidityAverage')).sendKeys();
    sample.element(by.name('turbidityAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.turbidity.average);
    });
    // Ammonia
    sample.element(by.name('ammoniaMethod')).all(by.tagName('option')).get(2).click();
    sample.element(by.name('ammoniaUnits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('ammoniaResult1')).sendKeys(waterQuality1.ammonia.results[0]);
    sample.element(by.name('ammoniaResult2')).sendKeys(waterQuality1.ammonia.results[1]);
    sample.element(by.name('ammoniaResult3')).sendKeys(waterQuality1.ammonia.results[2]);
    sample.element(by.name('ammoniaAverage')).sendKeys();
    // Nitrates
    sample.element(by.name('nitratesMethod')).all(by.tagName('option')).get(2).click();
    sample.element(by.name('nitratesUnits')).all(by.tagName('option')).get(1).click();
    sample.element(by.name('nitratesResult1')).sendKeys(measurements.nitrates.results[0]);
    sample.element(by.name('nitratesResult2')).sendKeys(measurements.nitrates.results[1]);
    sample.element(by.name('nitratesResult3')).sendKeys(measurements.nitrates.results[2]);
    sample.element(by.name('nitratesAverage')).sendKeys();
    sample.element(by.name('nitratesAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.nitrates.average);
    });
    // Other
    //var other = sample.element(by.repeater('other in sample.others')).get(0);
    sample.element(by.name('otherLabel')).sendKeys(measurements.others[0].other1.label);
    sample.element(by.name('otherMethod')).sendKeys(measurements.others[0].other1.method);
    sample.element(by.name('otherUnits')).sendKeys(measurements.others[0].other1.units);
    sample.element(by.name('otherResult1')).sendKeys(measurements.others[0].other1.results[0]);
    sample.element(by.name('otherResult2')).sendKeys(measurements.others[0].other1.results[1]);
    sample.element(by.name('otherResult3')).sendKeys(measurements.others[0].other1.results[2]);
    sample.element(by.name('otherAverage')).sendKeys();
    sample.element(by.name('otherAverage')).getAttribute('value').then(function(value) {
      expect(value).toEqual(measurements.others[0].other1.average);
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
      browser.sleep(1000);
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
      fillOutMobileOrganismDetails(organism1, mobileTrap1);
      fillOutMobileOrganismDetails(organism2, mobileTrap2);

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 5000);
      var protocol3tab = element(by.id('protocol3tab'));
      expect(protocol3tab.isPresent()).toBe(true);
      expect(protocol3tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to fill out protocol 5', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol5tab')).click();
      browser.sleep(1000);
      browser.wait(EC.visibilityOf(element(by.repeater('sample in waterQuality.samples'))), 5000);

      // Fill in values
      var samples = element.all(by.repeater('sample in waterQuality.samples'));
      var sample1 = samples.get(0);
      fillOutWaterQualitySample(sample1, 0, waterQuality1);

      // Save draft
      element(by.buttonText('Save Draft')).click();
      // Wait until saving is done
      browser.wait(EC.invisibilityOf(element(by.id('saving-exp-spinner'))), 5000);
      var protocol5tab = element(by.id('protocol5tab'));
      expect(protocol5tab.isPresent()).toBe(true);
      expect(protocol5tab.element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol1tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
      //expect(element(by.id('protocol3tab')).element(by.className('glyphicon-ok-sign')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to submit protocols 1, 3, & 5', function() {
      // Submit
      element(by.buttonText('Submit')).click();

      // Assert that only protocols 1, 3, & 5 are clickable
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
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);

    });
  });

  describe('Team member 2 view Expedition', function () {
    it ('should allow team member 2 to click protocols 2 & 4', function () {
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
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(true);
      firstLink.click();
    });

    it ('should allow team member 2 to view protocols 2 & 4', function() {
      // Oyster Measurements tab should be visible
      expect(element(by.partialLinkText('Oyster Measurements')).isDisplayed()).toBe(true);
      // Settlement Tiles tab should be visible
      expect(element(by.partialLinkText('Settlement Tiles')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to fill out protocol 1', function() {
      element(by.partialLinkText('Oyster Measurements')).click();
      browser.sleep(1000);
      // Fill in values
      element(by.model('oysterMeasurement.depthOfOysterCage.submergedDepthofCageM')).sendKeys(oysterMeasurement1.depthOfOysterCage.submergedDepthofCageM);
      uploadImage('oyster-cage-condition-image-dropzone');
      element(by.model('oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage')).all(by.tagName('option')).get(3).click();
      element(by.model('oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage')).sendKeys(oysterMeasurement1.conditionOfOysterCage.notesOnDamageToCage);
    });
  });
});
