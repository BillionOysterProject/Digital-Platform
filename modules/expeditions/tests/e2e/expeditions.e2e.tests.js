'use strict';

var path = require('path'),
  moment = require('moment'),
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

  var assertImage = function(id) {
    element(by.id(id)).element(by.css('img[class="img-thumbnail"]')).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  };

  var defaultMapCoordinates = function(target) {
    element(by.css('a[data-target="#'+target+'"]')).click();
    element(by.id('saveMapSelectModal-'+target)).click();
    browser.sleep(1000);
    browser.wait(EC.invisibilityOf(element(by.id('saveMapSelectModal-'+target))), 5000);
  };

  var assertMapCoordinates = function(target) {
    element(by.css('input[data-target="#'+target+'"]')).getAttribute('value')
    .then(function(text){
      expect(text).not.toEqual('');
      expect(text.search(', ')).toBeGreaterThan(-1);
    });
  };

  var siteCondition1 = {
    meteorologicalConditions: {
      airTemperatureC: 23,
      windSpeedMPH: 4,
      humidityPer: 23,
      weatherConditions: 3,
      weatherConditionsText: 'Cloudy',
      windDirection: 4,
      windDirectionText: 'South West'
    },
    recentRainfall: {
      rainedIn7Days: 1,
      rainedIn7DaysText: 'Yes',
      rainedIn72Hours: 1,
      rainedIn72HoursText: 'Yes',
      rainedIn24Hours: 1,
      rainedIn24HoursText: 'Yes'
    },
    tideConditions: {
      currentSpeedMPH: 3,
      currentDirection: 3,
      currentDirectionText: 'East',
      tidalCurrent: 2,
      tidalCurrentText: 'Slack water'
    },
    waterConditions: {
      waterColor: 4,
      waterColorText: 'Dark Green',
      oilSheen: 1,
      oilSheenText: 'Yes',
      garbage: {
        garbagePresent: 1,
        garbagePresentText: 'Yes',
        hardPlastic: 1,
        hardPlasticText: 'None',
        softPlastic: 2,
        softPlasticText: 'Sporadic',
        metal: 3,
        metalText: 'Common',
        paper: 4,
        paperText: 'Extensive',
        glass: 1,
        glassText: 'None',
        organic: 2,
        organicText: 'Sporadic',
        other: {
          description: 'wood',
          extent: 3,
          extentText: 'Common'
        }
      },
      markedCombinedSewerOverflowPipes: {
        markedCSOPresent: 1,
        markedCSOPresentText: 'Yes',
        flowThroughPresent: 1,
        flowThroughPresentText: 'Yes',
        howMuchFlowThrough: 3,
        howMuchFlowThroughText: 'Steady Stream',
        location: {
          latitude: 39.765,
          longitude: -76.234,
        }
      },
      unmarkedOutfallPipes: {
        unmarkedPipePresent: 1,
        unmarkedPipePresentText: 'Yes',
        flowThroughPresent: 1,
        flowThroughPresentText: 'Yes',
        howMuchFlowThrough: 1,
        howMuchFlowThroughText: 'Trickle',
        location: {
          latitude: 39.765,
          longitude: -76.234,
        },
        approximateDiameterCM: 3
      }
    },
    landConditions: {
      shoreLineType: 3,
      shoreLineTypeText: 'Floating Dock',
      garbage: {
        garbagePresent: 1,
        garbagePresentText: 'Yes',
        hardPlastic: 4,
        hardPlasticText: 'Extensive',
        softPlastic: 1,
        softPlasticText: 'None',
        metal: 2,
        metalText: 'Sporadic',
        paper: 3,
        paperText: 'Common',
        glass: 4,
        glassText: 'Extensive',
        organic: 1,
        organicText: 'None',
        other: {
          description: 'wood',
          extent: 2,
          extentText: 'Sporadic'
        }
      },
      shorelineSurfaceCoverEstPer: {
        imperviousSurfacePer: 33,
        perviousSurfacePer: 33,
        vegetatedSurfacePer: 34
      }
    }
  };

  var assertSiteCondition = function() {
    // Meteorological Conditions
    expect(element(by.model('siteCondition.meteorologicalConditions.weatherConditions')).$('option:checked').getText()).toEqual(siteCondition1.meteorologicalConditions.weatherConditionsText);
    expect(element(by.model('siteCondition.meteorologicalConditions.airTemperatureC')).getAttribute('value')).toEqual(siteCondition1.meteorologicalConditions.airTemperatureC.toString());
    expect(element(by.model('siteCondition.meteorologicalConditions.windSpeedMPH')).getAttribute('value')).toEqual(siteCondition1.meteorologicalConditions.windSpeedMPH.toString());
    expect(element(by.model('siteCondition.meteorologicalConditions.windDirection')).$('option:checked').getText()).toEqual(siteCondition1.meteorologicalConditions.windDirectionText);
    expect(element(by.model('siteCondition.meteorologicalConditions.humidityPer')).getAttribute('value')).toEqual(siteCondition1.meteorologicalConditions.humidityPer.toString());
    expect(element(by.model('siteCondition.recentRainfall.rainedIn7Days')).$('option:checked').getText()).toEqual(siteCondition1.recentRainfall.rainedIn7DaysText);
    expect(element(by.model('siteCondition.recentRainfall.rainedIn72Hours')).$('option:checked').getText()).toEqual(siteCondition1.recentRainfall.rainedIn72HoursText);
    expect(element(by.model('siteCondition.recentRainfall.rainedIn24Hours')).$('option:checked').getText()).toEqual(siteCondition1.recentRainfall.rainedIn24HoursText);
    // Tide Conditions
    expect(element(by.model('siteCondition.tideConditions.currentSpeedMPH')).getAttribute('value')).toEqual(siteCondition1.tideConditions.currentSpeedMPH.toString());
    expect(element(by.model('siteCondition.tideConditions.currentDirection')).$('option:checked').getText()).toEqual(siteCondition1.tideConditions.currentDirectionText);
    expect(element(by.model('siteCondition.tideConditions.tidalCurrent')).$('option:checked').getText()).toEqual(siteCondition1.tideConditions.tidalCurrentText);
    // Water Conditions
    assertImage('water-condition-image-dropzone');
    expect(element(by.model('siteCondition.waterConditions.waterColor')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.waterColorText);
    expect(element(by.model('siteCondition.waterConditions.oilSheen')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.oilSheenText);
    expect(element(by.model('siteCondition.waterConditions.garbage.garbagePresent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.garbagePresentText);
    expect(element(by.model('siteCondition.waterConditions.garbage.hardPlastic')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.hardPlasticText);
    expect(element(by.model('siteCondition.waterConditions.garbage.softPlastic')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.softPlasticText);
    expect(element(by.model('siteCondition.waterConditions.garbage.metal')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.metalText);
    expect(element(by.model('siteCondition.waterConditions.garbage.paper')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.paperText);
    expect(element(by.model('siteCondition.waterConditions.garbage.glass')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.glassText);
    expect(element(by.model('siteCondition.waterConditions.garbage.organic')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.organicText);
    expect(element(by.model('siteCondition.waterConditions.garbage.other.description')).getAttribute('value')).toEqual(siteCondition1.waterConditions.garbage.other.description);
    expect(element(by.model('siteCondition.waterConditions.garbage.other.extent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.garbage.other.extentText);
    expect(element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresentText);
    expect(element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.unmarkedOutfallPipes.unmarkedPipePresentText);
    assertMapCoordinates('modal-map-marked');
    expect(element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresentText);
    expect(element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThroughText);
    assertMapCoordinates('modal-map-unmarked');
    expect(element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM')).getAttribute('value')).toEqual(siteCondition1.waterConditions.unmarkedOutfallPipes.approximateDiameterCM.toString());
    expect(element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.unmarkedOutfallPipes.flowThroughPresentText);
    expect(element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough')).$('option:checked').getText()).toEqual(siteCondition1.waterConditions.unmarkedOutfallPipes.howMuchFlowThroughText);
    // Land Conditions
    assertImage('land-condition-image-dropzone');
    expect(element(by.model('siteCondition.landConditions.shoreLineType')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.shoreLineTypeText);
    expect(element(by.model('siteCondition.landConditions.garbage.garbagePresent')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.garbagePresentText);
    expect(element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer')).getAttribute('value')).toEqual(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer.toString());
    expect(element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer')).getAttribute('value')).toEqual(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer.toString());
    expect(element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer')).getAttribute('value')).toEqual(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer.toString());
    expect(element(by.model('siteCondition.landConditions.garbage.hardPlastic')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.hardPlasticText);
    expect(element(by.model('siteCondition.landConditions.garbage.softPlastic')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.softPlasticText);
    expect(element(by.model('siteCondition.landConditions.garbage.metal')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.metalText);
    expect(element(by.model('siteCondition.landConditions.garbage.paper')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.paperText);
    expect(element(by.model('siteCondition.landConditions.garbage.glass')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.glassText);
    expect(element(by.model('siteCondition.landConditions.garbage.organic')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.organicText);
    expect(element(by.model('siteCondition.landConditions.garbage.other.description')).getAttribute('value')).toEqual(siteCondition1.landConditions.garbage.other.description);
    expect(element(by.model('siteCondition.landConditions.garbage.other.extent')).$('option:checked').getText()).toEqual(siteCondition1.landConditions.garbage.other.extentText);
  };

  var oysterMeasurement1 = {
    depthOfOysterCage: {
      submergedDepthofCageM: 5
    },
    conditionOfOysterCage: {
      bioaccumulationOnCage: 3,
      bioaccumulationOnCageText: 'Medium – Some encrusting macroalgae/animals reducing size of mesh opening up to 25%',
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
        measurements: [11.1]
      }, {
        source: 'sourceC',
        totalNumberOfLiveOystersOnShell: 2,
        notes: 'Test notes 3',
        measurements: [23.1, 21.0]
      }, {
        source: 'sourceD',
        totalNumberOfLiveOystersOnShell: 3,
        notes: 'Test notes 3',
        measurements: [32.1, 33.1, 38.2]
      }, {
        source: 'sourceE',
        totalNumberOfLiveOystersOnShell: 4,
        notes: 'Test notes 4',
        measurements: [43.1, 40.1, 47.3, 44.2]
      }, {
        source: 'sourceF',
        totalNumberOfLiveOystersOnShell: 5,
        notes: 'Test notes 5',
        measurements: [53.2, 52.1, 55.2, 58.4, 57.2]
      }, {
        source: 'sourceG',
        totalNumberOfLiveOystersOnShell: 4,
        notes: 'Test notes 6',
        measurements: [65.2, 66.3, 62.1, 67.4]
      }, {
        source: 'sourceH',
        totalNumberOfLiveOystersOnShell: 3,
        notes: 'Test notes 7',
        measurements: [77.3, 74.2, 72.1]
      }, {
        source: 'sourceI',
        totalNumberOfLiveOystersOnShell: 2,
        notes: 'Test notes 8',
        measurements: [88.3, 84.3]
      }, {
        source: 'sourceJ',
        totalNumberOfLiveOystersOnShell: 1,
        notes: 'Test notes 9',
        measurements: [93.2]
      }, {
        source: 'sourceK',
        totalNumberOfLiveOystersOnShell: 0,
        notes: 'Test notes 2',
        measurements: []
      }]
    }
  };

  var assertSubstrateMeasurements = function(index) {
    element(by.id('edit-measurements-'+index)).click();
    // Wait until the modal is open
    var modal = element(by.id('modal-substrateshell'+index));
    browser.wait(EC.visibilityOf(modal), 10000);

    // Add an image to the substrate shell
    assertImage('outer-substrate-image-dropzone-'+index); // substrate shell outer photo
    assertImage('inner-substrate-image-dropzone-'+index); // substrate shell inner photo

    var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];

    expect(modal.element(by.model('substrate.source')).getAttribute('value')).toEqual(measurementsDetails.source);
    expect(modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersOnShell.toString());
    expect(modal.element(by.model('substrate.notes')).getAttribute('value')).toEqual(measurementsDetails.notes);

    if (measurementsDetails.totalNumberOfLiveOystersOnShell > 0 &&
      measurementsDetails.totalNumberOfLiveOystersOnShell === measurementsDetails.measurements.length) {
      modal.element(by.id('substrate-measurements')).click();

      //browser.wait(EC.visibilityOf(element(by.id('substrateshell-measurements'+index))), 5000);
      for (var i = 0; i < measurementsDetails.measurements.length; i++) {
        expect(modal.element(by.id('measure'+i)).getAttribute('value')).toEqual(measurementsDetails.measurements[i].toString());
      }
    }

    // Save the substrate shell
    modal.element(by.buttonText('Cancel')).click();
    //browser.wait(EC.invisibilityOf(modal), 5000);
  };

  var assertOysterMeasurements = function() {
    expect(element(by.model('oysterMeasurement.depthOfOysterCage.submergedDepthofCageM')).getAttribute('value')).toEqual(oysterMeasurement1.depthOfOysterCage.submergedDepthofCageM.toString());
    assertImage('oyster-cage-condition-image-dropzone');
    expect(element(by.model('oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage')).$('option:checked').getText()).toEqual(oysterMeasurement1.conditionOfOysterCage.bioaccumulationOnCageText);
    expect(element(by.model('oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage')).getAttribute('value')).toEqual(oysterMeasurement1.conditionOfOysterCage.notesOnDamageToCage);

    assertSubstrateMeasurements(0);
    assertSubstrateMeasurements(1);
    assertSubstrateMeasurements(2);
    assertSubstrateMeasurements(3);
    assertSubstrateMeasurements(4);
    assertSubstrateMeasurements(5);
    assertSubstrateMeasurements(6);
    assertSubstrateMeasurements(7);
    assertSubstrateMeasurements(8);
    assertSubstrateMeasurements(9);
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

  var assertMobileOrganismDetails = function(mobileOrganism, details) {
    var emptyCount = mobileOrganism.element(by.id('empty-mobile-organism-count'));
    var count = mobileOrganism.element(by.id('mobile-organism-count'));
    expect(count.isPresent()).toBe(true);
    expect(emptyCount.isPresent()).toBe(true);
    expect(count.getText()).toEqual(' 1 ');

    mobileOrganism.element(by.css('[ng-click="addOrganism(organism)"]')).getAttribute('organism-id').then(function(value) {
      // Get the id for the mobileOrganism
      var organismId = value;

      // Click the button to open the mobile organism details modal
      mobileOrganism.element(by.css('[ng-click="openOrganismDetails(organism)"]')).click();

      // Wait until the modal is open
      var modal = element(by.id('modal-organism-details-'+organismId));
      browser.wait(EC.visibilityOf(modal), 5000);

      // Add an image to the mobile organism details
      assertImage('mobileTrapSketchPhoto-'+organismId); // Mobile Trap Organism Detail Image Upload
      // Add a description
      expect(modal.element(by.model('organismDetails.notes')).getAttribute('value')).toEqual(details.organismDetails.notes);
      // Don't change the mobile organism details
      modal.element(by.buttonText('Cancel')).click();
      // Wait until the modal is closed and return
      browser.wait(EC.invisibilityOf(modal), 5000);
    });
  };

  var assertMobileTrap = function() {
    var mobileOrganisms = element.all(by.repeater('organism in mobileOrganisms track by organism._id'));
    assertMobileOrganismDetails(mobileOrganisms.get(0), mobileTrap1);
    assertMobileOrganismDetails(mobileOrganisms.get(1), mobileTrap2);
  };

  var settlementTiles1 = {
    settlementTile1: {
      description: 'Test description 1',
      organisms: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
      organismsText: ['Blue mussel','Boring sponges','Bushy brown bryozoan','Chain tunicate',
        'Conopeum bryozoans','Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian',
        'Hard tube worms','Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm',
        'Northern red anemone','Northern rock barnacle','Orange bryozoan','Orange sheath tunicate',
        'Oyster drill','Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase',
        'Slipper snails','Tube-building polychaete']
    },
    settlementTile2: {
      description: 'Test description 2',
      organisms: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      organismsText: ['Boring sponges','Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans',
        'Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms',
        'Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone',
        'Northern rock barnacle','Orange bryozoan','Orange sheath tunicate','Oyster drill',
        'Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase','Slipper snails',
        'Tube-building polychaete','Other (mark in notes)'],
      notes: 'Notes 1'
    },
    settlementTile3: {
      description: 'Test description 3',
      organisms: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,1],
      organismsText: ['Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans','Eastern mudsnail',
        'Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms','Hydroids',
        'Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
        'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
        'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
        'Other (mark in notes)','Blue mussel'],
      notes: 'Notes 2'
    },
    settlementTile4: {
      description: 'Test description 4',
      organisms: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,1,2],
      organismsText: ['Chain tunicate','Conopeum bryozoans','Eastern mudsnail','Frilled anemone',
        'Golden star tunicate, star ascidian','Hard tube worms','Hydroids','Ivory barnacle',
        'Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
        'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
        'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
        'Other (mark in notes)','Blue mussel','Boring sponges'],
      notes: 'Notes 3'
    }
  };

  var assertSettlementTile = function(tile, index, details) {
    expect(tile.element(by.model('tile.description')).getAttribute('value')).toEqual(details.description);
    assertImage('settlement-tile-image-dropzone-'+index);

    var openButton = element(by.id('edit-settlementtile-'+index));
    // if (index === 0 || index === 1) {
    //   browser.executeScript('window.scrollTo(0,0);').then(function () {
    //     openButton.click();
    //   });
    // } else if (index === 2 || index === 3) {
    //   browser.executeScript('window.scrollTo(0,700);').then(function () {
    //     openButton.click();
    //   });
    // } else {
    openButton.click();
    // }

    // Wait until the modal is open
    var modal = element(by.id('modal-settlementtile'+(index+1)));
    browser.wait(EC.visibilityOf(modal), 10000);

    for (var i = 0; i < details.organisms.length; i++) {
      expect(modal.element(by.id('organism'+i)).$('option:checked').getText()).toEqual(details.organismsText[i]);
      if (details.organisms[i] === 26) {
        expect(modal.element(by.id('notes'+i)).getAttribute('value')).toEqual(details.notes);
      }
    }

    // Close the substrate shell
    modal.element(by.buttonText('Cancel')).click();
    browser.wait(EC.invisibilityOf(modal), 5000);
  };

  var assertSettlementTiles = function() {
    var tiles = element.all(by.repeater('tile in settlementTiles.settlementTiles'));
    browser.executeScript('window.scrollTo(0,0);').then(function () {
      var tile1 = tiles.get(0);
      assertSettlementTile(tile1, 0, settlementTiles1.settlementTile1);
      var tile2 = tiles.get(1);
      assertSettlementTile(tile2, 1, settlementTiles1.settlementTile2);
      var tile3 = tiles.get(2);
      assertSettlementTile(tile3, 2, settlementTiles1.settlementTile3);
      var tile4 = tiles.get(3);
      assertSettlementTile(tile4, 3, settlementTiles1.settlementTile4);
    });
  };

  var waterQuality1 = {
    depthOfWaterSampleM: 5,
    waterTemperature: {
      method: 2,
      methodText: 'Analog thermometer',
      units: 2,
      unitsText: 'C',
      results: [11.2, 13.2, 12.7],
      average: '12.37'
    },
    dissolvedOxygen: {
      method: 3,
      methodText: 'Winkler',
      units: 1,
      unitsText: 'mg/L (PPM)',
      results: [23.8, 21.0, 25.3],
      average: '23.37'
    },
    salinity: {
      method: 1,
      methodText: 'Hydrometer',
      units: 1,
      unitsText: 'PPT',
      results: [36.1, 33.6, 30.6],
      average: '33.43'
    },
    pH: {
      method: 2,
      methodText: 'Sensor (read only)',
      units: 1,
      unitsText: 'pH (logscale)',
      results: [44.0, 41.3, 42.7],
      average: '42.67'
    },
    turbidity: {
      method: 1,
      methodText: 'Turbidity tube',
      units: 1,
      unitsText: 'CM',
      results: [55.3, 51.1, 53.8],
      average: '53.4'
    },
    ammonia: {
      method: 2,
      methodText: 'Photometer',
      units: 1,
      unitsText: 'PPM',
      results: [61.4, 63.3, 67.5],
      average: '64.07'
    },
    nitrates: {
      method: 2,
      methodText: 'Photometer',
      units: 1,
      unitsText: 'PPM',
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

  var waterQuality2 = {
    depthOfWaterSampleM: 4,
    waterTemperature: {
      method: 3,
      methodText: 'Sensor*',
      units: 1,
      unitsText: 'F',
      results: [13.5, 16.4, 10.9],
      average: '13.6'
    },
    dissolvedOxygen: {
      method: 1,
      methodText: 'Colormetric ampules',
      units: 2,
      unitsText: '% saturation',
      results: [22.4, 25.1, 24.9],
      average: '24.13'
    },
    salinity: {
      method: 2,
      methodText: 'Refractometer',
      units: 1,
      unitsText: 'PPT',
      results: [31.9, 33.1, 34.5],
      average: '33.17'
    },
    pH: {
      method: 1,
      methodText: 'Test strips',
      units: 1,
      unitsText: 'pH (logscale)',
      results: [41.3, 43.6, 42.0],
      average: '42.3'
    },
    turbidity: {
      method: 1,
      methodText: 'Turbidity tube',
      units: 1,
      unitsText: 'CM',
      results: [50.9, 52.4, 53.1],
      average: '52.13'
    },
    ammonia: {
      method: 1,
      methodText: 'Test strips',
      units: 1,
      unitsText: 'PPM',
      results: [60.3, 64.1, 63.4],
      average: '62.6'
    },
    nitrates: {
      method: 1,
      methodText: 'Test strips',
      units: 1,
      unitsText: 'PPM',
      results: [77.1, 74.4, 70.3],
      average: '73.93'
    },
    others: [{
      other1: {
        label: 'other2',
        method: 'method2',
        units: 'unit2',
        results: [86.2, 83.1, 82.2],
        average: '83.83'
      }
    }]
  };

  var assertWaterQualitySample = function(sample, index, measurements) {
    expect(sample.element(by.model('sample.depthOfWaterSampleM')).getAttribute('value')).toEqual(measurements.depthOfWaterSampleM.toString());
    assertMapCoordinates('modal-map-sample'+index);
    // Water Temperature
    expect(sample.element(by.name('waterTemperatureMethod')).$('option:checked').getText()).toEqual(measurements.waterTemperature.methodText);
    expect(sample.element(by.name('waterTemperatureUnits')).$('option:checked').getText()).toEqual(measurements.waterTemperature.unitsText);
    expect(sample.element(by.name('waterTemperatureResult1')).getAttribute('value')).toEqual(measurements.waterTemperature.results[0].toString());
    expect(sample.element(by.name('waterTemperatureResult2')).getAttribute('value')).toEqual(measurements.waterTemperature.results[1].toString());
    expect(sample.element(by.name('waterTemperatureResult3')).getAttribute('value')).toEqual(measurements.waterTemperature.results[2].toString());
    expect(sample.element(by.name('waterTemperatureAverage')).getAttribute('value')).toEqual(measurements.waterTemperature.average.toString());

    // Dissolved Oxygen
    expect(sample.element(by.name('dissolvedOxygenMethod')).$('option:checked').getText()).toEqual(measurements.dissolvedOxygen.methodText);
    expect(sample.element(by.name('dissolvedOxygenUnits')).$('option:checked').getText()).toEqual(measurements.dissolvedOxygen.unitsText);
    expect(sample.element(by.name('dissolvedOxygenResult1')).getAttribute('value')).toEqual(measurements.dissolvedOxygen.results[0].toString());
    expect(sample.element(by.name('dissolvedOxygenResult2')).getAttribute('value')).toEqual(measurements.dissolvedOxygen.results[1].toString());
    expect(sample.element(by.name('dissolvedOxygenResult3')).getAttribute('value')).toEqual(measurements.dissolvedOxygen.results[2].toString());
    expect(sample.element(by.name('dissolvedOxygenAverage')).getAttribute('value')).toEqual(measurements.dissolvedOxygen.average.toString());

    // Salinity
    expect(sample.element(by.name('salinityMethod')).$('option:checked').getText()).toEqual(measurements.salinity.methodText);
    expect(sample.element(by.name('salinityUnits')).$('option:checked').getText()).toEqual(measurements.salinity.unitsText);
    expect(sample.element(by.name('salinityResult1')).getAttribute('value')).toEqual(measurements.salinity.results[0].toString());
    expect(sample.element(by.name('salinityResult2')).getAttribute('value')).toEqual(measurements.salinity.results[1].toString());
    expect(sample.element(by.name('salinityResult3')).getAttribute('value')).toEqual(measurements.salinity.results[2].toString());
    expect(sample.element(by.name('salinityAverage')).getAttribute('value')).toEqual(measurements.salinity.average.toString());

    // pH
    expect(sample.element(by.name('pHmethod')).$('option:checked').getText()).toEqual(measurements.pH.methodText);
    expect(sample.element(by.name('pHunits')).$('option:checked').getText()).toEqual(measurements.pH.unitsText);
    expect(sample.element(by.name('pHresult1')).getAttribute('value')).toEqual(measurements.pH.results[0].toString());
    expect(sample.element(by.name('pHresult2')).getAttribute('value')).toEqual(measurements.pH.results[1].toString());
    expect(sample.element(by.name('pHresult3')).getAttribute('value')).toEqual(measurements.pH.results[2].toString());
    expect(sample.element(by.name('pHaverage')).getAttribute('value')).toEqual(measurements.pH.average.toString());

    // Turbidity
    expect(sample.element(by.name('turbidityMethod')).$('option:checked').getText()).toEqual(measurements.turbidity.methodText);
    expect(sample.element(by.name('turbidityUnits')).$('option:checked').getText()).toEqual(measurements.turbidity.unitsText);
    expect(sample.element(by.name('turbidityResult1')).getAttribute('value')).toEqual(measurements.turbidity.results[0].toString());
    expect(sample.element(by.name('turbidityResult2')).getAttribute('value')).toEqual(measurements.turbidity.results[1].toString());
    expect(sample.element(by.name('turbidityResult3')).getAttribute('value')).toEqual(measurements.turbidity.results[2].toString());
    expect(sample.element(by.name('turbidityAverage')).getAttribute('value')).toEqual(measurements.turbidity.average.toString());

    // Ammonia
    expect(sample.element(by.name('ammoniaMethod')).$('option:checked').getText()).toEqual(measurements.ammonia.methodText);
    expect(sample.element(by.name('ammoniaUnits')).$('option:checked').getText()).toEqual(measurements.ammonia.unitsText);
    expect(sample.element(by.name('ammoniaResult1')).getAttribute('value')).toEqual(measurements.ammonia.results[0].toString());
    expect(sample.element(by.name('ammoniaResult2')).getAttribute('value')).toEqual(measurements.ammonia.results[1].toString());
    expect(sample.element(by.name('ammoniaResult3')).getAttribute('value')).toEqual(measurements.ammonia.results[2].toString());
    expect(sample.element(by.name('ammoniaAverage')).getAttribute('value')).toEqual(measurements.ammonia.average.toString());

    // Nitrates
    expect(sample.element(by.name('nitratesMethod')).$('option:checked').getText()).toEqual(measurements.nitrates.methodText);
    expect(sample.element(by.name('nitratesUnits')).$('option:checked').getText()).toEqual(measurements.nitrates.unitsText);
    expect(sample.element(by.name('nitratesResult1')).getAttribute('value')).toEqual(measurements.nitrates.results[0].toString());
    expect(sample.element(by.name('nitratesResult2')).getAttribute('value')).toEqual(measurements.nitrates.results[1].toString());
    expect(sample.element(by.name('nitratesResult3')).getAttribute('value')).toEqual(measurements.nitrates.results[2].toString());
    expect(sample.element(by.name('nitratesAverage')).getAttribute('value')).toEqual(measurements.nitrates.average.toString());

    // Other
    //var other = sample.element(by.repeater('other in sample.others')).get(0);
    expect(sample.element(by.name('otherLabel')).getAttribute('value')).toEqual(measurements.others[0].other1.label);
    expect(sample.element(by.name('otherMethod')).getAttribute('value')).toEqual(measurements.others[0].other1.method);
    expect(sample.element(by.name('otherUnits')).getAttribute('value')).toEqual(measurements.others[0].other1.units);
    expect(sample.element(by.name('otherResult1')).getAttribute('value')).toEqual(measurements.others[0].other1.results[0].toString());
    expect(sample.element(by.name('otherResult2')).getAttribute('value')).toEqual(measurements.others[0].other1.results[1].toString());
    expect(sample.element(by.name('otherResult3')).getAttribute('value')).toEqual(measurements.others[0].other1.results[2].toString());
    expect(sample.element(by.name('otherAverage')).getAttribute('value')).toEqual(measurements.others[0].other1.average.toString());
  };

  var assertWaterQuality = function() {
    var samples = element.all(by.repeater('sample in waterQuality.samples'));
    assertWaterQualitySample(samples.get(0), 0, waterQuality1);
    assertWaterQualitySample(samples.get(1), 1, waterQuality2);
  };


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

//############################################################################//
//  TEAM MEMBER 1 - VIEW EXPEDITION
//############################################################################//

  describe('Team member 1 fill out Expedition', function () {
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

//############################################################################//
//  TEAM MEMBER 1 - SITE CONDITION
//############################################################################//

    it ('should allow team member 1 to fill out protocol 1', function() {
      element(by.partialLinkText('Site Conditions')).click();
      browser.sleep(1000);
      // Fill in values
      // Meteorological Conditions
      element(by.model('siteCondition.meteorologicalConditions.weatherConditions')).all(by.tagName('option')).get(siteCondition1.meteorologicalConditions.weatherConditions).click();
      element(by.model('siteCondition.meteorologicalConditions.airTemperatureC')).sendKeys(siteCondition1.meteorologicalConditions.airTemperatureC);
      element(by.model('siteCondition.meteorologicalConditions.windSpeedMPH')).sendKeys(siteCondition1.meteorologicalConditions.windSpeedMPH);
      element(by.model('siteCondition.meteorologicalConditions.windDirection')).all(by.tagName('option')).get(siteCondition1.meteorologicalConditions.windDirection).click();
      element(by.model('siteCondition.meteorologicalConditions.humidityPer')).sendKeys(siteCondition1.meteorologicalConditions.humidityPer);
      element(by.model('siteCondition.recentRainfall.rainedIn7Days')).all(by.tagName('option')).get(siteCondition1.recentRainfall.rainedIn7Days).click();
      element(by.model('siteCondition.recentRainfall.rainedIn72Hours')).all(by.tagName('option')).get(siteCondition1.recentRainfall.rainedIn72Hours).click();
      element(by.model('siteCondition.recentRainfall.rainedIn24Hours')).all(by.tagName('option')).get(siteCondition1.recentRainfall.rainedIn24Hours).click();
      // Tide Conditions
      element(by.model('siteCondition.tideConditions.currentSpeedMPH')).sendKeys(siteCondition1.tideConditions.currentSpeedMPH);
      element(by.model('siteCondition.tideConditions.currentDirection')).all(by.tagName('option')).get(siteCondition1.tideConditions.currentDirection).click();
      element(by.model('siteCondition.tideConditions.tidalCurrent')).all(by.tagName('option')).get(siteCondition1.tideConditions.tidalCurrent).click();
      // Water Conditions
      uploadImage('water-condition-image-dropzone'); // Water Condition Image Upload
      element(by.model('siteCondition.waterConditions.waterColor')).all(by.tagName('option')).get(siteCondition1.waterConditions.waterColor).click();
      element(by.model('siteCondition.waterConditions.oilSheen')).all(by.tagName('option')).get(siteCondition1.waterConditions.oilSheen).click();
      element(by.model('siteCondition.waterConditions.garbage.garbagePresent')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.garbagePresent).click();
      element(by.model('siteCondition.waterConditions.garbage.hardPlastic')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.hardPlastic).click();
      element(by.model('siteCondition.waterConditions.garbage.softPlastic')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.softPlastic).click();
      element(by.model('siteCondition.waterConditions.garbage.metal')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.metal).click();
      element(by.model('siteCondition.waterConditions.garbage.paper')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.paper).click();
      element(by.model('siteCondition.waterConditions.garbage.glass')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.glass).click();
      element(by.model('siteCondition.waterConditions.garbage.organic')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.organic).click();
      element(by.model('siteCondition.waterConditions.garbage.other.description')).sendKeys(siteCondition1.waterConditions.garbage.other.description);
      element(by.model('siteCondition.waterConditions.garbage.other.extent')).all(by.tagName('option')).get(siteCondition1.waterConditions.garbage.other.extent).click();
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent')).all(by.tagName('option')).get(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent).click();
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent')).all(by.tagName('option')).get(siteCondition1.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent).click();
      defaultMapCoordinates('modal-map-marked');
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent')).all(by.tagName('option')).get(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent).click();
      element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough')).all(by.tagName('option')).get(siteCondition1.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough).click();
      //defaultMapCoordinates('modal-map-unmarked');
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM')).sendKeys(siteCondition1.waterConditions.unmarkedOutfallPipes.approximateDiameterCM);
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent')).all(by.tagName('option')).get(siteCondition1.waterConditions.unmarkedOutfallPipes.flowThroughPresent).click();
      element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough')).all(by.tagName('option')).get(siteCondition1.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough).click();
      // Land Conditions
      uploadImage('land-condition-image-dropzone');
      element(by.model('siteCondition.landConditions.shoreLineType')).all(by.tagName('option')).get(siteCondition1.landConditions.shoreLineType).click();
      element(by.model('siteCondition.landConditions.garbage.garbagePresent')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.garbagePresent).click();
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer')).clear().sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer);
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer')).clear().sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer);
      element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer')).clear().sendKeys(siteCondition1.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer);
      element(by.model('siteCondition.landConditions.garbage.hardPlastic')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.hardPlastic).click();
      element(by.model('siteCondition.landConditions.garbage.softPlastic')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.softPlastic).click();
      element(by.model('siteCondition.landConditions.garbage.metal')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.metal).click();
      element(by.model('siteCondition.landConditions.garbage.paper')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.paper).click();
      element(by.model('siteCondition.landConditions.garbage.glass')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.glass).click();
      element(by.model('siteCondition.landConditions.garbage.organic')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.organic).click();
      element(by.model('siteCondition.landConditions.garbage.other.description')).sendKeys(siteCondition1.landConditions.garbage.other.description);
      element(by.model('siteCondition.landConditions.garbage.other.extent')).all(by.tagName('option')).get(siteCondition1.landConditions.garbage.other.extent).click();

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
//  TEAM MEMBER 1 - MOBILE TRAP
//############################################################################//

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

    it ('should allow team member 1 to fill out protocol 3', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol3tab')).click();
      browser.waitForAngular();
      browser.sleep(2000);
      browser.wait(EC.visibilityOf(element(by.repeater('organism in mobileOrganisms track by organism._id'))), 5000);

      // Fill in values, if you change these values, change the assert too
      var mobileOrganisms = element.all(by.repeater('organism in mobileOrganisms track by organism._id'));
      var organism1 = mobileOrganisms.get(0);
      var organism2 = mobileOrganisms.get(1);
      fillOutMobileOrganismDetails(organism1, mobileTrap1);
      fillOutMobileOrganismDetails(organism2, mobileTrap2);

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
//  TEAM MEMBER 1 - WATER QUALITY
//############################################################################//

    var fillOutWaterQualitySample = function(sample, index, measurements) {
      sample.element(by.model('sample.depthOfWaterSampleM')).sendKeys(measurements.depthOfWaterSampleM);
      defaultMapCoordinates('modal-map-sample'+index);
      // Water Temperature
      sample.element(by.name('waterTemperatureMethod')).all(by.tagName('option')).get(measurements.waterTemperature.method).click();
      sample.element(by.name('waterTemperatureUnits')).all(by.tagName('option')).get(measurements.waterTemperature.units).click();
      sample.element(by.name('waterTemperatureResult1')).sendKeys(measurements.waterTemperature.results[0]);
      sample.element(by.name('waterTemperatureResult2')).sendKeys(measurements.waterTemperature.results[1]);
      sample.element(by.name('waterTemperatureResult3')).sendKeys(measurements.waterTemperature.results[2]);
      sample.element(by.name('waterTemperatureAverage')).sendKeys();
      sample.element(by.name('waterTemperatureAverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.waterTemperature.average);
      });
      // Dissolved Oxygen
      sample.element(by.name('dissolvedOxygenMethod')).all(by.tagName('option')).get(measurements.dissolvedOxygen.method).click();
      sample.element(by.name('dissolvedOxygenUnits')).all(by.tagName('option')).get(measurements.dissolvedOxygen.units).click();
      sample.element(by.name('dissolvedOxygenResult1')).sendKeys(measurements.dissolvedOxygen.results[0]);
      sample.element(by.name('dissolvedOxygenResult2')).sendKeys(measurements.dissolvedOxygen.results[1]);
      sample.element(by.name('dissolvedOxygenResult3')).sendKeys(measurements.dissolvedOxygen.results[2]);
      sample.element(by.name('dissolvedOxygenAverage')).sendKeys();
      sample.element(by.name('dissolvedOxygenAverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.dissolvedOxygen.average);
      });
      // Salinity
      sample.element(by.name('salinityMethod')).all(by.tagName('option')).get(measurements.salinity.method).click();
      sample.element(by.name('salinityUnits')).all(by.tagName('option')).get(measurements.salinity.units).click();
      sample.element(by.name('salinityResult1')).sendKeys(measurements.salinity.results[0]);
      sample.element(by.name('salinityResult2')).sendKeys(measurements.salinity.results[1]);
      sample.element(by.name('salinityResult3')).sendKeys(measurements.salinity.results[2]);
      sample.element(by.name('salinityAverage')).sendKeys();
      sample.element(by.name('salinityAverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.salinity.average);
      });
      // pH
      sample.element(by.name('pHmethod')).all(by.tagName('option')).get(measurements.pH.method).click();
      sample.element(by.name('pHunits')).all(by.tagName('option')).get(measurements.pH.units).click();
      sample.element(by.name('pHresult1')).sendKeys(measurements.pH.results[0]);
      sample.element(by.name('pHresult2')).sendKeys(measurements.pH.results[1]);
      sample.element(by.name('pHresult3')).sendKeys(measurements.pH.results[2]);
      sample.element(by.name('pHaverage')).sendKeys();
      sample.element(by.name('pHaverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.pH.average);
      });
      // Turbidity
      sample.element(by.name('turbidityMethod')).all(by.tagName('option')).get(measurements.turbidity.method).click();
      sample.element(by.name('turbidityUnits')).all(by.tagName('option')).get(measurements.turbidity.units).click();
      sample.element(by.name('turbidityResult1')).sendKeys(measurements.turbidity.results[0]);
      sample.element(by.name('turbidityResult2')).sendKeys(measurements.turbidity.results[1]);
      sample.element(by.name('turbidityResult3')).sendKeys(measurements.turbidity.results[2]);
      sample.element(by.name('turbidityAverage')).sendKeys();
      sample.element(by.name('turbidityAverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.turbidity.average);
      });
      // Ammonia
      sample.element(by.name('ammoniaMethod')).all(by.tagName('option')).get(measurements.ammonia.method).click();
      sample.element(by.name('ammoniaUnits')).all(by.tagName('option')).get(measurements.ammonia.units).click();
      sample.element(by.name('ammoniaResult1')).sendKeys(measurements.ammonia.results[0]);
      sample.element(by.name('ammoniaResult2')).sendKeys(measurements.ammonia.results[1]);
      sample.element(by.name('ammoniaResult3')).sendKeys(measurements.ammonia.results[2]);
      sample.element(by.name('ammoniaAverage')).sendKeys();
      sample.element(by.name('ammoniaAverage')).getAttribute('value').then(function(value) {
        expect(value).toEqual(measurements.ammonia.average);
      });
      // Nitrates
      sample.element(by.name('nitratesMethod')).all(by.tagName('option')).get(measurements.nitrates.method).click();
      sample.element(by.name('nitratesUnits')).all(by.tagName('option')).get(measurements.nitrates.units).click();
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

    it ('should allow team member 1 to fill out protocol 5', function() {
      // Click on the Mobile Trap tab
      element(by.id('protocol5tab')).click();
      browser.sleep(1000);
      browser.wait(EC.visibilityOf(element(by.repeater('sample in waterQuality.samples'))), 5000);

      // Fill in values
      var samples = element.all(by.repeater('sample in waterQuality.samples'));
      var sample1 = samples.get(0);
      fillOutWaterQualitySample(sample1, 0, waterQuality1);

      element(by.css('a[ng-click="addSampleForm()"]')).click();
      samples = element.all(by.repeater('sample in waterQuality.samples'));
      var sample2 = samples.get(1);
      fillOutWaterQualitySample(sample2, 1, waterQuality2);

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
//  TEAM MEMBER 1 - SUBMIT PROTOCOLS 1, 3, & 5
//############################################################################//

    it ('should allow team member 1 to submit protocols 1, 3, & 5', function() {
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
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
    });
  });

//############################################################################//
//  TEAM MEMBER 2 - VIEW EXPEDITION
//############################################################################//

  describe('Team member 2 fill out Expedition', function () {
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

//############################################################################//
//  TEAM MEMBER 2 - OYSTER MEASUREMENT
//############################################################################//

    var fillOutOysterMeasurements = function(index) {
      element(by.id('edit-measurements-'+index)).click();
      // Wait until the modal is open
      var modal = element(by.id('modal-substrateshell'+index));
      browser.wait(EC.visibilityOf(modal), 10000);

      // Add an image to the substrate shell
      uploadImage('outer-substrate-image-dropzone-'+index); // substrate shell outer photo
      uploadImage('inner-substrate-image-dropzone-'+index); // substrate shell inner photo

      var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];

      modal.element(by.model('substrate.source')).sendKeys(measurementsDetails.source);
      modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersOnShell);
      modal.element(by.model('substrate.notes')).sendKeys(measurementsDetails.notes);

      if (measurementsDetails.totalNumberOfLiveOystersOnShell > 0 &&
        measurementsDetails.totalNumberOfLiveOystersOnShell === measurementsDetails.measurements.length) {
        modal.element(by.id('substrate-measurements')).click();

        //browser.wait(EC.visibilityOf(element(by.id('substrateshell-measurements'+index))), 5000);
        for (var i = 0; i < measurementsDetails.measurements.length; i++) {
          modal.element(by.id('measure'+i)).sendKeys(measurementsDetails.measurements[i]);
        }
      }

      // Save the substrate shell
      modal.element(by.buttonText('Save')).click();
      //browser.wait(EC.invisibilityOf(modal), 5000);
    };

    it ('should allow team member 2 to fill out protocol 2', function() {
      element(by.partialLinkText('Oyster Measurements')).click();
      browser.sleep(1000);

      browser.wait(EC.visibilityOf(element(by.cssContainingText('.blue', 'measuring growth and recording mortality of oysters'))), 5000);
      // Fill in values
      element(by.model('oysterMeasurement.depthOfOysterCage.submergedDepthofCageM')).sendKeys(oysterMeasurement1.depthOfOysterCage.submergedDepthofCageM);
      uploadImage('oyster-cage-condition-image-dropzone');
      element(by.model('oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage')).all(by.tagName('option')).get(oysterMeasurement1.conditionOfOysterCage.bioaccumulationOnCage).click();
      element(by.model('oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage')).sendKeys(oysterMeasurement1.conditionOfOysterCage.notesOnDamageToCage);

      browser.wait(EC.visibilityOf(element(by.repeater('substrate in oysterMeasurement.measuringOysterGrowth.substrateShells'))), 5000);

      fillOutOysterMeasurements(0);
      fillOutOysterMeasurements(1);
      fillOutOysterMeasurements(2);
      fillOutOysterMeasurements(3);
      fillOutOysterMeasurements(4);
      fillOutOysterMeasurements(5);
      fillOutOysterMeasurements(6);
      fillOutOysterMeasurements(7);
      fillOutOysterMeasurements(8);
      fillOutOysterMeasurements(9);

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
//  TEAM MEMBER 2 - SETTLEMENT TILES
//############################################################################//

    var fillOutSettlementTile = function(tile, index, details) {
      tile.element(by.model('tile.description')).sendKeys(details.description);
      uploadImage('settlement-tile-image-dropzone-'+index);

      element(by.id('edit-settlementtile-'+index)).click();
      // Wait until the modal is open
      var modal = element(by.id('modal-settlementtile'+(index+1)));
      browser.wait(EC.visibilityOf(modal), 10000);

      for (var i = 0; i < details.organisms.length; i++) {
        modal.element(by.id('organism'+i)).all(by.tagName('option')).get(details.organisms[i]).click();
        if (details.organisms[i] === 26) {
          modal.element(by.id('notes'+i)).sendKeys(details.notes);
        }
      }

      // Save the substrate shell
      modal.element(by.buttonText('Save')).click();
      browser.wait(EC.invisibilityOf(modal), 5000);
    };

    it ('should allow team member 2 to fill out protocol 4', function() {
      element(by.partialLinkText('Settlement Tiles')).click();
      browser.sleep(1000);

      browser.wait(EC.visibilityOf(element(by.repeater('tile in settlementTiles.settlementTiles'))), 5000);

      var tiles = element.all(by.repeater('tile in settlementTiles.settlementTiles'));
      var tile1 = tiles.get(0);
      fillOutSettlementTile(tile1, 0, settlementTiles1.settlementTile1);
      var tile2 = tiles.get(1);
      fillOutSettlementTile(tile2, 1, settlementTiles1.settlementTile2);
      var tile3 = tiles.get(2);
      fillOutSettlementTile(tile3, 2, settlementTiles1.settlementTile3);
      var tile4 = tiles.get(3);
      fillOutSettlementTile(tile4, 3, settlementTiles1.settlementTile4);

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
//  TEAM MEMBER 2 - SUBMIT PROTOCOLS 2 & 4
//############################################################################//

    it ('should allow team member 2 to submit protocols 2 & 4', function() {
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
      expect(element(by.id('protocol1Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol1View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol2Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol3Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol4Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5Link')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5View')).isDisplayed()).toBe(false);

      expect(element(by.id('protocol1Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol2Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol3Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol5Link')).element(by.cssContainingText('.label-danger', 'Returned')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 1 to click on protocols 1, 3, & 5', function() {
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

    it ('should allow team member 1 to resubmit protocols 1, 3, & 5', function() {
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
      expect(element(by.id('protocol3View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
      expect(element(by.id('protocol4View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(false);
      expect(element(by.id('protocol5View')).element(by.cssContainingText('.label-success', 'Submitted')).isDisplayed()).toBe(true);
    });

    it ('should allow team member 2 to click on protocols 2 & 4', function() {
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

    it ('should allow team member 2 to resubmit protocols 2 & 4', function() {
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
//  TEAM LEAD - PUBLISH EXPEDITION
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
});
