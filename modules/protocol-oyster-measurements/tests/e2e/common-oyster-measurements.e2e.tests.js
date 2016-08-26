'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  moment = require('moment'),
  EC = protractor.ExpectedConditions;

var oysterMeasurement1 = {
  depthOfOysterCage: {
    submergedDepthofCageM: 5
  },
  conditionOfOysterCage: {
    bioaccumulationOnCage: 3,
    bioaccumulationOnCageText: 'Medium – Some encrusting macroalgae/animals reducing size of mesh opening up to 25%',
    notesOnDamageToCage: 'Test description of damage 3'
  },
  measuringOysterGrowth: {
    substrateShells: [{
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 10,
      totalNumberOfLiveOystersOnShell: 0,
      totalMassOfScrubbedSubstrateShellOystersTagG: 0,
      notes: 'Test notes 1',
      measurements: [{
      }]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 11,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 2',
      measurements: [11.1]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 12,
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 3',
      measurements: [23.1, 21.0]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      totalNumberOfLiveOystersAtBaseline: 13,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 4',
      measurements: [32.1, 33.1, 38.2]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      totalNumberOfLiveOystersAtBaseline: 14,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 5',
      measurements: [43.1, 40.1, 47.3, 44.2]
    }, {
      source: 6,
      sourceText: 'Hudson River, New York',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: 50,
      notes: 'Test notes 6',
      measurements: [53.2, 52.1, 55.2, 58.4, 57.2]
    }, {
      source: 7,
      sourceText: 'Other',
      otherSource: 'Other Test',
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 7',
      measurements: [65.2, 66.3, 62.1, 67.4]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 17,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 8',
      measurements: [77.3, 74.2, 72.1]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 18,
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 9',
      measurements: [88.3, 84.3]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 19,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 10',
      measurements: [93.2]
    }]
  }
};

var oysterMeasurement2 = {
  depthOfOysterCage: {
    submergedDepthofCageM: 10
  },
  conditionOfOysterCage: {
    bioaccumulationOnCage: 1,
    bioaccumulationOnCageText: 'None/clean – No macroalgae or animals present',
    notesOnDamageToCage: 'Test description of damage 1'
  },
  totalNumberOfAllLiveOysters: 145,
  averageSizeOfAllLiveOysters: '55.03',
  minimumSizeOfAllLiveOysters: '11.10',
  maximumSizeOfAllLiveOysters: '96.10',
  measuringOysterGrowth: {
    substrateShells: [{
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 10,
      totalNumberOfLiveOystersOnShell: 10,
      totalMassOfScrubbedSubstrateShellOystersTagG: '100.00',
      notes: 'Test notes 1a',
      averageSizeOfLiveOysters: '11.55',
      minimumSizeOfLiveOysters: '11.10',
      maximumSizeOfLiveOysters: '12.00',
      measurements: [11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12.0]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 11,
      totalNumberOfLiveOystersOnShell: 11,
      totalMassOfScrubbedSubstrateShellOystersTagG: '110.00',
      notes: 'Test notes 2a',
      averageSizeOfLiveOysters: '15.60',
      minimumSizeOfLiveOysters: '15.10',
      maximumSizeOfLiveOysters: '16.10',
      measurements: [15.1,15.2,15.3,15.4,15.5,15.6,15.7,15.8,15.9,16.0,16.1]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 12,
      totalNumberOfLiveOystersOnShell: 12,
      totalMassOfScrubbedSubstrateShellOystersTagG: '120.00',
      notes: 'Test notes 3a',
      averageSizeOfLiveOysters: '23.25',
      minimumSizeOfLiveOysters: '20.90',
      maximumSizeOfLiveOysters: '27.30',
      measurements: [23.1,21.0,22.3,21.7,25.3,23.8,22.7,20.9,27.3,22.1,23.4,25.4]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 13,
      totalNumberOfLiveOystersOnShell: 13,
      totalMassOfScrubbedSubstrateShellOystersTagG: '130.00',
      notes: 'Test notes 4a',
      averageSizeOfLiveOysters: '33.24',
      minimumSizeOfLiveOysters: '30.10',
      maximumSizeOfLiveOysters: '38.20',
      measurements: [32.1,33.1,38.2,32.2,33.2,34.5,30.1,32.4,34.7,31.5,
        30.9,32.8,36.4]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 14,
      totalNumberOfLiveOystersOnShell: 14,
      totalMassOfScrubbedSubstrateShellOystersTagG: '140.00',
      notes: 'Test notes 5a',
      averageSizeOfLiveOysters: '43.66',
      minimumSizeOfLiveOysters: '40.10',
      maximumSizeOfLiveOysters: '47.30',
      measurements: [43.1,40.1,47.3,44.2,44.3,42.1,45.4,43.2,45.7,44.1,
        43.2,42.3,45.3,41.0]
    }, {
      source: 6,
      sourceText: 'Hudson River, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 15,
      totalMassOfScrubbedSubstrateShellOystersTagG: '150.00',
      notes: 'Test notes 6a',
      averageSizeOfLiveOysters: '54.11',
      minimumSizeOfLiveOysters: '50.80',
      maximumSizeOfLiveOysters: '58.40',
      measurements: [53.2,52.1,55.2,58.4,57.2,55.3,52.3,55.8,53.2,54.7,
        56.4,50.8,51.3,53.4,52.3]
    }, {
      source: 7,
      sourceText: 'Other',
      otherSource: 'Other Test',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 16,
      totalMassOfScrubbedSubstrateShellOystersTagG: '160.00',
      notes: 'Test notes 7a',
      averageSizeOfLiveOysters: '64.09',
      minimumSizeOfLiveOysters: '60.40',
      maximumSizeOfLiveOysters: '67.40',
      measurements: [65.2,66.3,62.1,67.4,62.1,66.4,65.3,60.4,62.4,63.3,
        67.3,63.3,65.6,62.0,63.1,63.3]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 17,
      totalNumberOfLiveOystersOnShell: 17,
      totalMassOfScrubbedSubstrateShellOystersTagG: '170.00',
      notes: 'Test notes 8a',
      averageSizeOfLiveOysters: '73.74',
      minimumSizeOfLiveOysters: '70.80',
      maximumSizeOfLiveOysters: '77.40',
      measurements: [77.3,74.2,72.1,77.4,73.1,72.2,73.4,76.4,73.5,70.8,
        71.9,72.3,73.5,74.4,72.7,75.5,72.9]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 18,
      totalNumberOfLiveOystersOnShell: 18,
      totalMassOfScrubbedSubstrateShellOystersTagG: '180.00',
      notes: 'Test notes 9a',
      averageSizeOfLiveOysters: '83.71',
      minimumSizeOfLiveOysters: '80.10',
      maximumSizeOfLiveOysters: '88.30',
      measurements: [88.3,84.3,80.1,83.2,80.9,84.3,81.1,85.5,86.3,82.8,83.3,
        85.7,82.6,81.4,85.8,83.7,84.2,83.2]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 19,
      totalNumberOfLiveOystersOnShell: 19,
      totalMassOfScrubbedSubstrateShellOystersTagG: '190.00',
      notes: 'Test notes 10a',
      averageSizeOfLiveOysters: '93.31',
      minimumSizeOfLiveOysters: '90.00',
      maximumSizeOfLiveOysters: '96.10',
      measurements: [93.2,90.9,93.3,94.4,91.8,94.7,95.7,91.1,93.5,94.5,95.7,
        93.4,92.2,93.6,90.0,92.5,96.1,93.7,92.6]
    }]
  }
};

var oysterMeasurement3 = {
  depthOfOysterCage: {
    submergedDepthofCageM: 8
  },
  conditionOfOysterCage: {
    bioaccumulationOnCage: 2,
    bioaccumulationOnCageText: 'Light – Macroalgae or minimal animals present that do not encroach on mesh openings',
    notesOnDamageToCage: 'Test description of damage 2'
  },
  measuringOysterGrowth: {
    substrateShells: [{
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 10,
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: 50,
      notes: 'Test notes 1b',
      measurements: [11.2,11.4,11.6,11.8,12.0]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 11,
      totalNumberOfLiveOystersOnShell: 6,
      totalMassOfScrubbedSubstrateShellOystersTagG: 60,
      notes: 'Test notes 2b',
      measurements: [15.2,15.5,15.6,15.8,16.0,16.1]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 12,
      totalNumberOfLiveOystersOnShell: 6,
      totalMassOfScrubbedSubstrateShellOystersTagG: 60,
      notes: 'Test notes 3b',
      measurements: [22.3,21.7,22.7,20.9,23.4,25.4]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      totalNumberOfLiveOystersAtBaseline: 13,
      totalNumberOfLiveOystersOnShell: 7,
      totalMassOfScrubbedSubstrateShellOystersTagG: 70,
      notes: 'Test notes 4b',
      measurements: [32.2,33.2,34.5,34.7,31.5,30.9,36.4]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      totalNumberOfLiveOystersAtBaseline: 14,
      totalNumberOfLiveOystersOnShell: 7,
      totalMassOfScrubbedSubstrateShellOystersTagG: 70,
      notes: 'Test notes 5b',
      measurements: [44.2,44.3,43.2,45.7,43.2,42.3,41.0]
    }, {
      source: 6,
      sourceText: 'Hudson River, New York',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 8,
      totalMassOfScrubbedSubstrateShellOystersTagG: 80,
      notes: 'Test notes 6b',
      measurements: [53.2,58.4,57.2,55.8,53.2,56.4,50.8,51.3]
    }, {
      source: 7,
      sourceText: 'Other',
      otherSource: 'Other Test',
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 8,
      totalMassOfScrubbedSubstrateShellOystersTagG: 80,
      notes: 'Test notes 7b',
      measurements: [62.1,67.4,62.1,60.4,62.4,63.3,65.6,63.3]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 17,
      totalNumberOfLiveOystersOnShell: 9,
      totalMassOfScrubbedSubstrateShellOystersTagG: 90,
      notes: 'Test notes 8b',
      measurements: [72.1,72.2,73.4,76.4,71.9,72.3,73.5,75.5,72.9]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 18,
      totalNumberOfLiveOystersOnShell: 9,
      totalMassOfScrubbedSubstrateShellOystersTagG: 90,
      notes: 'Test notes 9b',
      measurements: [88.3,83.2,80.9,81.1,82.8,83.3,85.7,85.8,84.2]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 19,
      totalNumberOfLiveOystersOnShell: 10,
      totalMassOfScrubbedSubstrateShellOystersTagG: 100,
      notes: 'Test notes 10b',
      measurements: [93.3,94.4,95.7,91.1,93.5,93.4,92.2,92.5,96.1,93.7]
    }]
  }
};

// Get the formatted date
var getDate = function(string) {
  return moment(string).format('MMMM D, YYYY');
};

// Get the formatted date
var getShortDate = function(string) {
  return moment(string).format('M/D/YY');
};

// Get the formatted time
var getTime = function(string) {
  return moment(string).format('h:mma');
};

// Get the formatted date and time
var getDateTime = function(string) {
  return moment(string).format('MMM D, YYYY, h:mma');
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

  expect(modal.element(by.model('substrate.source')).$('option:checked').getText()).toEqual(measurementsDetails.sourceText);
  if (measurementsDetails.otherSource) expect(modal.element(by.model('substrate.otherSource')).getAttribute('value')).toEqual(measurementsDetails.otherSource);
  expect(modal.element(by.model('substrate.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersAtBaseline.toString());
  expect(modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersOnShell.toString());
  expect(modal.element(by.model('substrate.totalMassOfScrubbedSubstrateShellOystersTagG')).getAttribute('value')).toEqual(measurementsDetails.totalMassOfScrubbedSubstrateShellOystersTagG.toString());
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

var fillOutOysterMeasurements = function(index) {
  element(by.id('edit-measurements-'+index)).click();
  // Wait until the modal is open
  var modal = element(by.id('modal-substrateshell'+index));
  browser.wait(EC.visibilityOf(modal), 10000);

  // Add an image to the substrate shell
  uploadImage('outer-substrate-image-dropzone-'+index); // substrate shell outer photo
  uploadImage('inner-substrate-image-dropzone-'+index); // substrate shell inner photo

  var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];

  //modal.element(by.model('substrate.source')).all(by.tagName('option')).get(measurementsDetails.source).click();
  //if (measurementsDetails.otherSource) modal.element(by.model('substrate.otherSource')).sendKeys(measurementsDetails.otherSource);
  //modal.element(by.model('substrate.totalNumberOfLiveOystersAtBaseline')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersAtBaseline);
  expect(modal.element(by.model('substrate.source')).$('option:checked').getText()).toEqual(measurementsDetails.sourceText);
  if (measurementsDetails.otherSource) expect(modal.element(by.model('substrate.otherSource')).getAttribute('value')).toEqual(measurementsDetails.otherSource);
  expect(modal.element(by.model('substrate.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersAtBaseline.toString());
  modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersOnShell);
  modal.element(by.model('substrate.totalMassOfScrubbedSubstrateShellOystersTagG')).clear().sendKeys(measurementsDetails.totalMassOfScrubbedSubstrateShellOystersTagG);
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

var fillOutAllOysterMeasurements = function() {
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
};

var assertSubstrateMeasurementView = function(index, values) {
  var substrate = values.measuringOysterGrowth.substrateShells[index];

  expect(element(by.id('substrateShellNumber'+index)).getText())
    .toEqual('Substrate Shell ' + (index+1));
  element(by.id('outerSidePhoto'+index)).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  element(by.id('innerSidePhoto'+index)).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  if (substrate.sourceText === 'Other') {
    expect(element(by.id('substrateMetadata'+index)).getText())
      .toEqual('Set at ' + getDateTime(substrate.setDate) + '\n' +
      'Source: ' + substrate.otherSource + ' Notes: ' + substrate.notes);
  } else {
    expect(element(by.id('substrateMetadata'+index)).getText())
    .toEqual('Set at ' + getDateTime(substrate.setDate) + '\n' +
    'Source: ' + substrate.sourceText + ' Notes: ' + substrate.notes);
  }
  if (substrate.totalNumberOfLiveOystersAtBaseline) {
    if (substrate.totalNumberOfLiveOystersOnShell < substrate.totalNumberOfLiveOystersAtBaseline) {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'down from ' + substrate.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    } else if (substrate.totalNumberOfLiveOystersOnShell > substrate.totalNumberOfLiveOystersAtBaseline) {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'up from ' + substrate.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    } else {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'same as ' + substrate.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    }
  } else {
    expect(element(by.id('totalLiveOystersNoBaseline'+index)).getText())
      .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
      'total number of live oysters at baseline not provided');
  }
  if (substrate.totalMassOfScrubbedSubstrateShellOystersTagG) {
    expect(element(by.id('totalMassOfOysters'+index)).getText())
      .toEqual(substrate.totalMassOfScrubbedSubstrateShellOystersTagG + ' total mass (shell + oysters + tag)');
  } else {
    expect(element(by.id('noMassOfOysters'+index)).getText())
      .toEqual('total mass not provided (shell + oysters + tag)');
  }
  expect(element(by.id('averageSizeOfLiveOysters'+index)).getText())
    .toEqual(substrate.averageSizeOfLiveOysters + '\naverage size');
  expect(element(by.id('minMaxSizeOfLiveOysters'+index)).getText())
    .toEqual(substrate.minimumSizeOfLiveOysters + ' min size\n' +
    substrate.maximumSizeOfLiveOysters + ' max size');
};

var assertOysterMeasurementsView = function(values, teamMember) {
  //Meta data
  var members = element.all(by.repeater('member in oysterMeasurement.teamMembers'));
  expect(members.count()).toEqual(1);
  var member = members.get(0);
  expect(member.element(by.binding('member.displayName')).isPresent()).toBe(true);
  expect(member.element(by.binding('member.displayName')).getText()).toEqual(teamMember.displayName);
  if (values.notes) {
    expect(element(by.binding('oysterMeasurement.notes')).isPresent()).toBe(true);
    expect(element(by.binding('oysterMeasurement.notes')).getText()).toEqual('Notes: ' + values.notes);
  }
  //Oyster Cage
  element(by.id('cageConditionPhoto')).getAttribute('src')
  .then(function(text){
    if (text !== null) {
      expect(text).not.toEqual('');
      expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
    }
  });
  expect(element(by.binding('oysterMeasurement.depthOfOysterCage.submergedDepthofCageM')).getText())
    .toEqual(values.depthOfOysterCage.submergedDepthofCageM + ' meters\nSubmerged depth');
  if (values.conditionOfOysterCage.bioaccumulationOnCageText === 'Heavy – Encrusting macroalgae/animals reducing mesh opening by over 50%') {
    expect(element(by.id('bioaccumulationHeavy')).isPresent()).toBe(true);
  } else if (values.conditionOfOysterCage.bioaccumulationOnCageText === 'Medium – Some encrusting macroalgae/animals reducing size of mesh opening up to 25%') {
    expect(element(by.id('bioaccumulationMedium')).isPresent()).toBe(true);
  } else if (values.conditionOfOysterCage.bioaccumulationOnCageText === 'Light – Macroalgae or minimal animals present that do not encroach on mesh openings') {
    expect(element(by.id('bioaccumulationLight')).isPresent()).toBe(true);
  } else {
    expect(element(by.id('noBioaccumulation')).isPresent()).toBe(true);
  }
  if (values.conditionOfOysterCage.notesOnDamageToCage) {
    expect(element(by.binding('oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage')).getText())
      .toEqual('Damage: ' + values.conditionOfOysterCage.notesOnDamageToCage);
  }
  expect(element(by.binding('oysterMeasurement.totalNumberOfAllLiveOysters')).getText())
    .toEqual(values.totalNumberOfAllLiveOysters + ' total oysters alive');
  if (values.previous) {

  } else {
    expect(element(by.cssContainingText('.green', 'average size')).getText())
      .toEqual(values.averageSizeOfAllLiveOysters + ' average size');
    expect(element(by.binding('oysterMeasurement.minimumSizeOfAllLiveOysters')).getText())
      .toEqual(values.minimumSizeOfAllLiveOysters);
    expect(element(by.binding('oysterMeasurement.maximumSizeOfAllLiveOysters')).getText())
      .toEqual(values.maximumSizeOfAllLiveOysters);
  }
  assertSubstrateMeasurementView(0, values);
  assertSubstrateMeasurementView(1, values);
  assertSubstrateMeasurementView(2, values);
  assertSubstrateMeasurementView(3, values);
  assertSubstrateMeasurementView(4, values);
  assertSubstrateMeasurementView(5, values);
  assertSubstrateMeasurementView(6, values);
  assertSubstrateMeasurementView(7, values);
  assertSubstrateMeasurementView(8, values);
  assertSubstrateMeasurementView(9, values);
};

module.exports = {
  oysterMeasurement1: oysterMeasurement1,
  oysterMeasurement2: oysterMeasurement2,
  oysterMeasurement3: oysterMeasurement3,
  assertSubstrateMeasurements: assertSubstrateMeasurements,
  assertOysterMeasurements: assertOysterMeasurements,
  fillOutOysterMeasurements: fillOutOysterMeasurements,
  fillOutAllOysterMeasurements: fillOutAllOysterMeasurements,
  assertOysterMeasurementsView: assertOysterMeasurementsView
};
