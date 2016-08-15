'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates;

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
    closestHighTideHeight: 6,
    closestLowTideHeight: 3,
    referencePoint: 'Test reference point',
    tidalCurrent: 2,
    tidalCurrentText: 'Slack water'
  },
  waterConditions: {
    surfaceCurrentSpeedMPS: 4,
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
  expect(element(by.model('siteCondition.tideConditions.closestHighTideHeight')).getAttribute('value')).toEqual(siteCondition1.tideConditions.closestHighTideHeight.toString());
  expect(element(by.model('siteCondition.tideConditions.closestLowTideHeight')).getAttribute('value')).toEqual(siteCondition1.tideConditions.closestLowTideHeight.toString());
  expect(element(by.model('siteCondition.tideConditions.referencePoint')).getAttribute('value')).toEqual(siteCondition1.tideConditions.referencePoint.toString());
  expect(element(by.model('siteCondition.tideConditions.tidalCurrent')).$('option:checked').getText()).toEqual(siteCondition1.tideConditions.tidalCurrentText);
  // Water Conditions
  assertImage('water-condition-image-dropzone');
  expect(element(by.model('siteCondition.waterConditions.surfaceCurrentSpeedMPS')).getAttribute('value')).toEqual(siteCondition1.waterConditions.surfaceCurrentSpeedMPS.toString());
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

var fillOutSiteConditions = function(siteCondition) {
  // Meteorological Conditions
  element(by.model('siteCondition.meteorologicalConditions.weatherConditions')).all(by.tagName('option')).get(siteCondition.meteorologicalConditions.weatherConditions).click();
  element(by.model('siteCondition.meteorologicalConditions.airTemperatureC')).sendKeys(siteCondition.meteorologicalConditions.airTemperatureC);
  element(by.model('siteCondition.meteorologicalConditions.windSpeedMPH')).sendKeys(siteCondition.meteorologicalConditions.windSpeedMPH);
  element(by.model('siteCondition.meteorologicalConditions.windDirection')).all(by.tagName('option')).get(siteCondition.meteorologicalConditions.windDirection).click();
  element(by.model('siteCondition.meteorologicalConditions.humidityPer')).sendKeys(siteCondition.meteorologicalConditions.humidityPer);
  element(by.model('siteCondition.recentRainfall.rainedIn7Days')).all(by.tagName('option')).get(siteCondition.recentRainfall.rainedIn7Days).click();
  element(by.model('siteCondition.recentRainfall.rainedIn72Hours')).all(by.tagName('option')).get(siteCondition.recentRainfall.rainedIn72Hours).click();
  element(by.model('siteCondition.recentRainfall.rainedIn24Hours')).all(by.tagName('option')).get(siteCondition.recentRainfall.rainedIn24Hours).click();
  // Tide Conditions
  element(by.model('siteCondition.tideConditions.closestHighTideHeight')).sendKeys(siteCondition.tideConditions.closestHighTideHeight);
  element(by.model('siteCondition.tideConditions.closestLowTideHeight')).sendKeys(siteCondition.tideConditions.closestLowTideHeight);
  element(by.model('siteCondition.tideConditions.referencePoint')).sendKeys(siteCondition.tideConditions.referencePoint);
  element(by.model('siteCondition.tideConditions.tidalCurrent')).all(by.tagName('option')).get(siteCondition.tideConditions.tidalCurrent).click();
  // Water Conditions
  uploadImage('water-condition-image-dropzone'); // Water Condition Image Upload
  element(by.model('siteCondition.waterConditions.surfaceCurrentSpeedMPS')).sendKeys(siteCondition.waterConditions.surfaceCurrentSpeedMPS);
  element(by.model('siteCondition.waterConditions.waterColor')).all(by.tagName('option')).get(siteCondition.waterConditions.waterColor).click();
  element(by.model('siteCondition.waterConditions.oilSheen')).all(by.tagName('option')).get(siteCondition.waterConditions.oilSheen).click();
  element(by.model('siteCondition.waterConditions.garbage.garbagePresent')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.garbagePresent).click();
  element(by.model('siteCondition.waterConditions.garbage.hardPlastic')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.hardPlastic).click();
  element(by.model('siteCondition.waterConditions.garbage.softPlastic')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.softPlastic).click();
  element(by.model('siteCondition.waterConditions.garbage.metal')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.metal).click();
  element(by.model('siteCondition.waterConditions.garbage.paper')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.paper).click();
  element(by.model('siteCondition.waterConditions.garbage.glass')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.glass).click();
  element(by.model('siteCondition.waterConditions.garbage.organic')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.organic).click();
  element(by.model('siteCondition.waterConditions.garbage.other.description')).sendKeys(siteCondition.waterConditions.garbage.other.description);
  element(by.model('siteCondition.waterConditions.garbage.other.extent')).all(by.tagName('option')).get(siteCondition.waterConditions.garbage.other.extent).click();
  element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent')).all(by.tagName('option')).get(siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent).click();
  element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent')).all(by.tagName('option')).get(siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent).click();
  defaultMapCoordinates('modal-map-marked');
  element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent')).all(by.tagName('option')).get(siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent).click();
  element(by.model('siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough')).all(by.tagName('option')).get(siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough).click();
  //defaultMapCoordinates('modal-map-unmarked');
  element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM')).sendKeys(siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM);
  element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent')).all(by.tagName('option')).get(siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent).click();
  element(by.model('siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough')).all(by.tagName('option')).get(siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough).click();
  // Land Conditions
  uploadImage('land-condition-image-dropzone');
  element(by.model('siteCondition.landConditions.shoreLineType')).all(by.tagName('option')).get(siteCondition.landConditions.shoreLineType).click();
  element(by.model('siteCondition.landConditions.garbage.garbagePresent')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.garbagePresent).click();
  element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer')).clear().sendKeys(siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer);
  element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer')).clear().sendKeys(siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer);
  element(by.model('siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer')).clear().sendKeys(siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer);
  element(by.model('siteCondition.landConditions.garbage.hardPlastic')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.hardPlastic).click();
  element(by.model('siteCondition.landConditions.garbage.softPlastic')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.softPlastic).click();
  element(by.model('siteCondition.landConditions.garbage.metal')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.metal).click();
  element(by.model('siteCondition.landConditions.garbage.paper')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.paper).click();
  element(by.model('siteCondition.landConditions.garbage.glass')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.glass).click();
  element(by.model('siteCondition.landConditions.garbage.organic')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.organic).click();
  element(by.model('siteCondition.landConditions.garbage.other.description')).sendKeys(siteCondition.landConditions.garbage.other.description);
  element(by.model('siteCondition.landConditions.garbage.other.extent')).all(by.tagName('option')).get(siteCondition.landConditions.garbage.other.extent).click();
};

module.exports = {
  siteCondition1: siteCondition1,
  assertSiteCondition: assertSiteCondition,
  fillOutSiteConditions: fillOutSiteConditions
};
