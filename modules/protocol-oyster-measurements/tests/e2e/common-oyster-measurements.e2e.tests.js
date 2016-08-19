'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  EC = protractor.ExpectedConditions;

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
      notes: 'Test notes 3',
      measurements: [32.1, 33.1, 38.2]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      totalNumberOfLiveOystersAtBaseline: 14,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 4',
      measurements: [43.1, 40.1, 47.3, 44.2]
    }, {
      source: 6,
      sourceText: 'Hudson River, New York',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: 50,
      notes: 'Test notes 5',
      measurements: [53.2, 52.1, 55.2, 58.4, 57.2]
    }, {
      source: 7,
      sourceText: 'Other',
      otherSource: 'Other Test',
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 6',
      measurements: [65.2, 66.3, 62.1, 67.4]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 17,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 7',
      measurements: [77.3, 74.2, 72.1]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 18,
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 8',
      measurements: [88.3, 84.3]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 19,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 9',
      measurements: [93.2]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      totalNumberOfLiveOystersAtBaseline: 20,
      totalNumberOfLiveOystersOnShell: 0,
      totalMassOfScrubbedSubstrateShellOystersTagG: 0,
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

  modal.element(by.model('substrate.source')).all(by.tagName('option')).get(measurementsDetails.source).click();
  if (measurementsDetails.otherSource) modal.element(by.model('substrate.otherSource')).sendKeys(measurementsDetails.otherSource);
  modal.element(by.model('substrate.totalNumberOfLiveOystersAtBaseline')).clear().sendKeys(measurementsDetails.totalNumberOfLiveOystersAtBaseline);
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

var assertOysterMeasurementsView = function() {
};

module.exports = {
  oysterMeasurement1: oysterMeasurement1,
  assertSubstrateMeasurements: assertSubstrateMeasurements,
  assertOysterMeasurements: assertOysterMeasurements,
  fillOutOysterMeasurements: fillOutOysterMeasurements,
  fillOutAllOysterMeasurements: fillOutAllOysterMeasurements,
  assertOysterMeasurementsView: assertOysterMeasurementsView
};
