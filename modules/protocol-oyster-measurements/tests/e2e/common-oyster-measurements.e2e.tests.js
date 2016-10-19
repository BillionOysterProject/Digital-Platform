'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  CommonUsers = require('../../../users/tests/e2e/common-users.e2e.tests'),
  station = CommonUsers.station,
  station2 = CommonUsers.station2,
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
      totalNumberOfLiveOystersOnShell: 0,
      totalMassOfScrubbedSubstrateShellOystersTagG: 0,
      notes: 'Test notes 1',
      photoPresent: true,
      measurements: [{
      }]
    }, {
      updateBaseline: true,
      source: 2,
      sourceText: 'Soundview, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 30,
      totalMassOfLiveOystersAtBaselineG: 300,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 2',
      photoPresent: true,
      measurements: [11.1]
    }, {
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 3',
      photoPresent: false,
      measurements: [23.1, 21.0]
    }, {
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 4',
      photoPresent: true,
      measurements: [32.1, 33.1, 38.2]
    }, {
      source: 5,
      sourceText: 'Hudson River, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 20,
      totalMassOfLiveOystersAtBaselineG: 200,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 5',
      photoPresent: true,
      measurements: [43.1, 40.1, 47.3, 44.2]
    }, {
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: 50,
      notes: 'Test notes 6',
      photoPresent: false,
      measurements: [53.2, 52.1, 55.2, 58.4, 57.2]
    }, {
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 7',
      photoPresent: true,
      measurements: [65.2, 66.3, 62.1, 67.4]
    }, {
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 8',
      photoPresent: true,
      measurements: [77.3, 74.2, 72.1]
    }, {
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 9',
      photoPresent: false,
      measurements: [88.3, 84.3]
    }, {
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 10',
      photoPresent: true,
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
      totalNumberOfLiveOystersAtBaseline: 40,
      totalNumberOfLiveOystersOnShell: 10,
      totalMassOfScrubbedSubstrateShellOystersTagG: '100.00',
      notes: 'Test notes 1a',
      photoPresent: true,
      averageSizeOfLiveOysters: '11.55',
      minimumSizeOfLiveOysters: '11.10',
      maximumSizeOfLiveOysters: '12.00',
      measurements: [11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12.0]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 35,
      totalNumberOfLiveOystersOnShell: 11,
      totalMassOfScrubbedSubstrateShellOystersTagG: '110.00',
      notes: 'Test notes 2a',
      photoPresent: true,
      averageSizeOfLiveOysters: '15.60',
      minimumSizeOfLiveOysters: '15.10',
      maximumSizeOfLiveOysters: '16.10',
      measurements: [15.1,15.2,15.3,15.4,15.5,15.6,15.7,15.8,15.9,16.0,16.1]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 30,
      totalNumberOfLiveOystersOnShell: 12,
      totalMassOfScrubbedSubstrateShellOystersTagG: '120.00',
      notes: 'Test notes 3a',
      photoPresent: true,
      averageSizeOfLiveOysters: '23.25',
      minimumSizeOfLiveOysters: '20.90',
      maximumSizeOfLiveOysters: '27.30',
      measurements: [23.1,21.0,22.3,21.7,25.3,23.8,22.7,20.9,27.3,22.1,23.4,25.4]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 25,
      totalNumberOfLiveOystersOnShell: 13,
      totalMassOfScrubbedSubstrateShellOystersTagG: '130.00',
      notes: 'Test notes 4a',
      photoPresent: true,
      averageSizeOfLiveOysters: '33.24',
      minimumSizeOfLiveOysters: '30.10',
      maximumSizeOfLiveOysters: '38.20',
      measurements: [32.1,33.1,38.2,32.2,33.2,34.5,30.1,32.4,34.7,31.5,
        30.9,32.8,36.4]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 20,
      totalNumberOfLiveOystersOnShell: 14,
      totalMassOfScrubbedSubstrateShellOystersTagG: '140.00',
      notes: 'Test notes 5a',
      photoPresent: true,
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
      photoPresent: true,
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
      totalNumberOfLiveOystersAtBaseline: 10,
      totalNumberOfLiveOystersOnShell: 6,
      totalMassOfScrubbedSubstrateShellOystersTagG: '60.00',
      notes: 'Test notes 7a',
      photoPresent: true,
      averageSizeOfLiveOysters: '63.65',
      minimumSizeOfLiveOysters: '60.40',
      maximumSizeOfLiveOysters: '67.40',
      measurements: [65.2,66.3,62.1,67.4,62.1,66.4,65.3,60.4,62.4,63.3,
        67.3,63.3,65.6,62.0,63.1,63.3]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 5,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: '30.00',
      notes: 'Test notes 8a',
      photoPresent: true,
      averageSizeOfLiveOysters: '73.77',
      minimumSizeOfLiveOysters: '70.80',
      maximumSizeOfLiveOysters: '77.40',
      measurements: [77.3,74.2,72.1,77.4,73.1,72.2,73.4,76.4,73.5,70.8,
        71.9,72.3,73.5,74.4,72.7,75.5,72.9]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 10,
      totalNumberOfLiveOystersOnShell: 8,
      totalMassOfScrubbedSubstrateShellOystersTagG: '80.00',
      notes: 'Test notes 9a',
      photoPresent: true,
      averageSizeOfLiveOysters: '83.46',
      minimumSizeOfLiveOysters: '80.10',
      maximumSizeOfLiveOysters: '88.30',
      measurements: [88.3,84.3,80.1,83.2,80.9,84.3,81.1,85.5,86.3,82.8,83.3,
        85.7,82.6,81.4,85.8,83.7,84.2,83.2]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 9,
      totalMassOfScrubbedSubstrateShellOystersTagG: '90.00',
      notes: 'Test notes 10a',
      photoPresent: true,
      averageSizeOfLiveOysters: '93.34',
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
  totalNumberOfAllLiveOysters: 5,
  averageSizeOfAllLiveOysters: '11.60',
  minimumSizeOfAllLiveOysters: '11.20',
  maximumSizeOfAllLiveOysters: '12.00',
  measuringOysterGrowth: {
    substrateShells: [{
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      setDate: '2016-08-20T18:30:00.000Z',
      totalNumberOfLiveOystersAtBaseline: 40,
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: '50.00',
      notes: 'Test notes 1b',
      photoPresent: true,
      minimumSizeOfLiveOysters: '11.20',
      maximumSizeOfLiveOysters: '12.00',
      averageSizeOfLiveOysters: '11.60',
      measurements: [11.2,11.4,11.6,11.8,12.0]
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

  var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];
  var baseline = station.baselines['substrateShell'+(index+1)];

  // Add an image to the substrate shell
  browser.sleep(100);
  if (measurementsDetails.photoPresent) assertImage('outer-substrate-image-dropzone-'+index); // substrate shell outer photo
  if (measurementsDetails.photoPresent) assertImage('inner-substrate-image-dropzone-'+index); // substrate shell inner photo

  // substrate meta
  modal.element(by.id('substrate-meta')).click();
  if (measurementsDetails.updateBaseline) {
    expect(modal.element(by.id('source-readonly')).getAttribute('value')).toEqual(measurementsDetails.sourceText);
    if (measurementsDetails.otherSource) expect(modal.element(by.model('baseline.otherSource')).getAttribute('value')).toEqual(measurementsDetails.otherSource);
    if (measurementsDetails.totalNumberOfLiveOystersAtBaseline) expect(modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersAtBaseline.toString());
    if (measurementsDetails.totalMassOfLiveOystersAtBaselineG) expect(modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).getAttribute('value')).toEqual(measurementsDetails.totalMassOfLiveOystersAtBaselineG.toString());
  } else {
    expect(modal.element(by.id('source-readonly')).getAttribute('value')).toEqual(baseline.sourceText);
    if (baseline.otherSource) expect(modal.element(by.model('baseline.otherSource')).getAttribute('value')).toEqual(baseline.otherSource);
    if (baseline.totalNumberOfLiveOystersAtBaseline) expect(modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(baseline.totalNumberOfLiveOystersAtBaseline.toString());
    if (baseline.totalMassOfLiveOystersAtBaselineG) expect(modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).getAttribute('value')).toEqual(baseline.totalMassOfLiveOystersAtBaselineG.toString());
  }

  // substrate measurements
  modal.element(by.id('substrate-measurements')).click();
  expect(modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).getAttribute('value')).toEqual(measurementsDetails.totalNumberOfLiveOystersOnShell.toString());
  expect(modal.element(by.model('substrate.totalMassOfScrubbedSubstrateShellOystersTagG')).getAttribute('value')).toEqual(measurementsDetails.totalMassOfScrubbedSubstrateShellOystersTagG.toString());
  expect(modal.element(by.model('substrate.notes')).getAttribute('value')).toEqual(measurementsDetails.notes);
  if (measurementsDetails.totalNumberOfLiveOystersOnShell > 0 &&
    measurementsDetails.totalNumberOfLiveOystersOnShell === measurementsDetails.measurements.length) {

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

  var measurementsDetails = oysterMeasurement1.measuringOysterGrowth.substrateShells[index];
  var baseline = station.baselines['substrateShell'+(index+1)];

  // Add an image to the substrate shell
  modal.element(by.id('substrate-photos')).click();
  if (measurementsDetails.photoPresent) uploadImage('outer-substrate-image-dropzone-'+index); // substrate shell outer photo
  if (measurementsDetails.photoPresent) uploadImage('inner-substrate-image-dropzone-'+index); // substrate shell inner photo

  // substrate meta
  modal.element(by.id('substrate-meta')).click();
  if (measurementsDetails.updateBaseline) {
    browser.sleep(200);
    modal.element(by.id('edit-baseline')).click();
    modal.element(by.id('source')).all(by.tagName('option')).get(measurementsDetails.source).click();
    if (measurementsDetails.otherSource) modal.element(by.model('baseline.otherSource')).sendKeys(measurementsDetails.otherSource);
    if (measurementsDetails.totalNumberOfLiveOystersAtBaseline) modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersAtBaseline);
    if (measurementsDetails.totalMassOfLiveOystersAtBaselineG) modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).clear().sendKeys(measurementsDetails.totalMassOfLiveOystersAtBaselineG);
  } else {
    expect(modal.element(by.id('source-readonly')).getAttribute('value')).toEqual(baseline.sourceText);
    if (baseline.otherSource) expect(modal.element(by.model('baseline.otherSource')).getAttribute('value')).toEqual(baseline.otherSource);
    if (baseline.totalNumberOfLiveOystersAtBaseline) expect(modal.element(by.model('baseline.totalNumberOfLiveOystersAtBaseline')).getAttribute('value')).toEqual(baseline.totalNumberOfLiveOystersAtBaseline.toString());
    if (baseline.totalMassOfLiveOystersAtBaselineG) expect(modal.element(by.model('baseline.totalMassOfLiveOystersAtBaselineG')).getAttribute('value')).toEqual(baseline.totalMassOfLiveOystersAtBaselineG.toString());
  }

  // substrate measurements
  modal.element(by.id('substrate-measurements')).click();
  modal.element(by.model('substrate.totalNumberOfLiveOystersOnShell')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersOnShell);
  modal.element(by.model('substrate.totalMassOfScrubbedSubstrateShellOystersTagG')).clear().sendKeys(measurementsDetails.totalMassOfScrubbedSubstrateShellOystersTagG);
  modal.element(by.model('substrate.notes')).sendKeys(measurementsDetails.notes);
  if (measurementsDetails.totalNumberOfLiveOystersOnShell > 0 &&
    measurementsDetails.totalNumberOfLiveOystersOnShell === measurementsDetails.measurements.length) {

    //browser.wait(EC.visibilityOf(element(by.id('substrateshell-measurements'+index))), 5000);
    for (var i = 0; i < measurementsDetails.measurements.length; i++) {
      modal.element(by.id('measure'+i)).sendKeys(measurementsDetails.measurements[i]);
    }
  }

  // Save the substrate shell
  modal.element(by.buttonText('Save')).click();

  browser.wait(EC.invisibilityOf(modal), 5000);
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

var assertSubstrateMeasurementView = function(index, values, stationValues) {
  var substrate = values.measuringOysterGrowth.substrateShells[index];
  var baseline = stationValues.baselines['substrateShell'+(index+1)];

  expect(element(by.id('substrateShellNumber'+index)).getText())
    .toEqual('Substrate Shell ' + (index+1));
  if (substrate.photoPresent) {
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
  }
  if (baseline.sourceText === 'Other') {
    expect(element(by.id('substrateMetadata'+index)).getText())
      .toEqual('Set at ' + getDate(baseline.setDate) + '\n' +
      'Source: ' + baseline.otherSource + ' Notes: ' + substrate.notes);
  } else {
    expect(element(by.id('substrateMetadata'+index)).getText())
    .toEqual('Set at ' + getDate(baseline.setDate) + '\n' +
    'Source: ' + baseline.sourceText + ' Notes: ' + substrate.notes);
  }
  if (baseline.totalNumberOfLiveOystersAtBaseline) {
    if (substrate.totalNumberOfLiveOystersOnShell < baseline.totalNumberOfLiveOystersAtBaseline) {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'down from ' + baseline.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    } else if (substrate.totalNumberOfLiveOystersOnShell > baseline.totalNumberOfLiveOystersAtBaseline) {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'up from ' + baseline.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    } else {
      expect(element(by.id('oystersAtBaselineCompare'+index)).getText())
        .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
        'same as ' + baseline.totalNumberOfLiveOystersAtBaseline + ' at baseline');
    }
  } else {
    expect(element(by.id('totalLiveOystersNoBaseline'+index)).getText())
      .toEqual(substrate.totalNumberOfLiveOystersOnShell + ' live oysters on shell\n' +
      'total number of live oysters at baseline not provided');
  }
  if (substrate.totalMassOfScrubbedSubstrateShellOystersTagG) {
    expect(element(by.id('totalMassOfOysters'+index)).getText())
      .toEqual(substrate.totalMassOfScrubbedSubstrateShellOystersTagG + ' g total mass (shell + oysters + tag)');
  } else {
    expect(element(by.id('noMassOfOysters'+index)).getText())
      .toEqual('total mass not provided (shell + oysters + tag)');
  }
  expect(element(by.id('averageSizeOfLiveOysters'+index)).getText())
    .toEqual(substrate.averageSizeOfLiveOysters + ' mm\naverage size');
  expect(element(by.id('minMaxSizeOfLiveOysters'+index)).getText())
    .toEqual(substrate.minimumSizeOfLiveOysters + ' mm min size\n' +
    substrate.maximumSizeOfLiveOysters + ' mm max size');
};

var assertOysterMeasurementsView = function(values, stationValues, teamMember) {
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
      .toEqual(values.averageSizeOfAllLiveOysters + ' mm average size');
    expect(element(by.binding('oysterMeasurement.minimumSizeOfAllLiveOysters')).getText())
      .toEqual(values.minimumSizeOfAllLiveOysters + ' mm');
    expect(element(by.binding('oysterMeasurement.maximumSizeOfAllLiveOysters')).getText())
      .toEqual(values.maximumSizeOfAllLiveOysters + ' mm');
  }
  assertSubstrateMeasurementView(0, values, stationValues);
  assertSubstrateMeasurementView(1, values, stationValues);
  assertSubstrateMeasurementView(2, values, stationValues);
  assertSubstrateMeasurementView(3, values, stationValues);
  assertSubstrateMeasurementView(4, values, stationValues);
  assertSubstrateMeasurementView(5, values, stationValues);
  assertSubstrateMeasurementView(6, values, stationValues);
  assertSubstrateMeasurementView(7, values, stationValues);
  assertSubstrateMeasurementView(8, values, stationValues);
  assertSubstrateMeasurementView(9, values, stationValues);
};

var assertOysterMeasurementCompare = function(index, values) {
  if (element(by.id('submerged-depth-compare')).isPresent()) {
    var submergedDepthRow = element(by.id('submerged-depth-compare')).all(by.tagName('td'));
    var submergedDepth = submergedDepthRow.get(index);
    expect(submergedDepth.getText()).toEqual(values.depthOfOysterCage.submergedDepthofCageM + ' meters ');
  }
  if (element(by.id('bioaccumulation-on-cage-compare')).isPresent()) {
    var bioaccumulationOnCageRow = element(by.id('bioaccumulation-on-cage-compare')).all(by.tagName('td'));
    var bioaccumulationOnCage = bioaccumulationOnCageRow.get(index);
    var bioaccumulationOnCageString = '';
    if (values.conditionOfOysterCage.bioaccumulationOnCage === 4) {
      bioaccumulationOnCageString = 'Heavy ';
    } else if (values.conditionOfOysterCage.bioaccumulationOnCage === 3) {
      bioaccumulationOnCageString = 'Medium ';
    } else if (values.conditionOfOysterCage.bioaccumulationOnCage === 2) {
      bioaccumulationOnCageString = 'Light ';
    } else if (values.conditionOfOysterCage.bioaccumulationOnCage === 1) {
      bioaccumulationOnCageString = 'None/clean';
    }
    expect(bioaccumulationOnCage.getText()).toEqual(bioaccumulationOnCageString + ' ');
  }
  if (element(by.id('cage-damage-compare')).isPresent()) {
    var cageDamageRow = element(by.id('cage-damage-compare')).all(by.tagName('td'));
    var cageDamage = cageDamageRow.get(index);
    expect(cageDamage.getText()).toEqual(values.conditionOfOysterCage.notesOnDamageToCage + ' ');
  }
  if (element(by.id('oyster-population-live-compare')).isPresent()) {
    var liveOystersRow = element(by.id('oyster-population-live-compare')).all(by.tagName('td'));
    var liveOysters = liveOystersRow.get(index);
    expect(liveOysters.getText()).toEqual(values.totalNumberOfAllLiveOysters.toString() + ' ');
  }
  if (element(by.id('oyster-population-avg-size-compare')).isPresent()) {
    var avgSizeRow = element(by.id('oyster-population-avg-size-compare')).all(by.tagName('td'));
    var avgSize = avgSizeRow.get(index);
    expect(avgSize.getText()).toEqual(values.averageSizeOfAllLiveOysters + 'mm ');
  }
  if (element(by.id('oyster-population-min-size-compare')).isPresent()) {
    var minSizeRow = element(by.id('oyster-population-min-size-compare')).all(by.tagName('td'));
    var minSize = minSizeRow.get(index);
    expect(minSize.getText()).toEqual(values.minimumSizeOfAllLiveOysters + 'mm ');
  }
  if (element(by.id('oyster-population-max-size-compare')).isPresent()) {
    var maxSizeRow = element(by.id('oyster-population-max-size-compare')).all(by.tagName('td'));
    var maxSize = maxSizeRow.get(index);
    expect(maxSize.getText()).toEqual(values.maximumSizeOfAllLiveOysters + 'mm ');
  }
};

module.exports = {
  oysterMeasurement1: oysterMeasurement1,
  oysterMeasurement2: oysterMeasurement2,
  oysterMeasurement3: oysterMeasurement3,
  assertSubstrateMeasurements: assertSubstrateMeasurements,
  assertOysterMeasurements: assertOysterMeasurements,
  fillOutOysterMeasurements: fillOutOysterMeasurements,
  fillOutAllOysterMeasurements: fillOutAllOysterMeasurements,
  assertOysterMeasurementsView: assertOysterMeasurementsView,
  assertOysterMeasurementCompare: assertOysterMeasurementCompare
};
