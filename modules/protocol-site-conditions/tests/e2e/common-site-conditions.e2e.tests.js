'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests'),
  leader = CommonUser.leader,
  member1 = CommonUser.member1,
  member2 = CommonUser.member2,
  moment = require('moment');

var siteCondition1 = {
  notes: 'This is a test',
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

var siteCondition2 = {
  notes: 'This is a test for site condition',
  meteorologicalConditions: {
    airTemperatureC: 20,
    windSpeedMPH: 3,
    humidityPer: 19,
    weatherConditions: 4,
    weatherConditionsText: 'Rain',
    windDirection: 5,
    windDirectionText: 'South'
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
    closestHighTideHeight: 10,
    closestLowTideHeight: 2,
    referencePoint: 'Test reference point 2',
    tidalCurrent: 3,
    tidalCurrentText: 'Ebb current (outgoing tide)'
  },
  waterConditions: {
    surfaceCurrentSpeedMPS: 5,
    waterColor: 1,
    waterColorText: 'Light Blue',
    oilSheen: 1,
    oilSheenText: 'Yes',
    garbage: {
      garbagePresent: 1,
      garbagePresentText: 'Yes',
      hardPlastic: 2,
      hardPlasticText: 'Sporadic',
      softPlastic: 2,
      softPlasticText: 'Sporadic',
      metal: 3,
      metalText: 'Common',
      paper: 3,
      paperText: 'Common',
      glass: 1,
      glassText: 'None',
      organic: 1,
      organicText: 'None',
      other: {
        description: 'goop',
        extent: 4,
        extentText: 'Extensive'
      }
    },
    markedCombinedSewerOverflowPipes: {
      markedCSOPresent: 1,
      markedCSOPresentText: 'Yes',
      flowThroughPresent: 1,
      flowThroughPresentText: 'Yes',
      howMuchFlowThrough: 1,
      howMuchFlowThroughText: 'Trickle',
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
      howMuchFlowThrough: 2,
      howMuchFlowThroughText: 'Light Stream',
      location: {
        latitude: 39.765,
        longitude: -76.234,
      },
      approximateDiameterCM: 10
    }
  },
  landConditions: {
    shoreLineType: 2,
    shoreLineTypeText: 'Fixed Pier',
    garbage: {
      garbagePresent: 1,
      garbagePresentText: 'Yes',
      hardPlastic: 4,
      hardPlasticText: 'Extensive',
      softPlastic: 4,
      softPlasticText: 'Extensive',
      metal: 2,
      metalText: 'Sporadic',
      paper: 2,
      paperText: 'Sporadic',
      glass: 1,
      glassText: 'None',
      organic: 1,
      organicText: 'None',
      other: {
        description: 'ooze',
        extent: 3,
        extentText: 'Common'
      }
    },
    shorelineSurfaceCoverEstPer: {
      imperviousSurfacePer: 30,
      perviousSurfacePer: 40,
      vegetatedSurfacePer: 30
    }
  }
};

var siteCondition3 = {
  notes: 'This is a test for site condition 2',
  meteorologicalConditions: {
    airTemperatureC: 18,
    windSpeedMPH: 1,
    humidityPer: 12,
    weatherConditions: 5,
    weatherConditionsText: 'Fog',
    windDirection: 7,
    windDirectionText: 'East'
  },
  recentRainfall: {
    rainedIn7Days: 2,
    rainedIn7DaysText: 'No'
  },
  tideConditions: {
    closestHighTideHeight: 7,
    closestLowTideHeight: 1,
    referencePoint: 'Test reference point 3',
    tidalCurrent: 1,
    tidalCurrentText: 'Flood current (incoming tide)'
  },
  waterConditions: {
    surfaceCurrentSpeedMPS: 4,
    waterColor: 5,
    waterColorText: 'Light Brown',
    oilSheen: 2,
    oilSheenText: 'No',
    garbage: {
      garbagePresent: 2,
      garbagePresentText: 'No'
    },
    markedCombinedSewerOverflowPipes: {
      markedCSOPresent: 2,
      markedCSOPresentText: 'No'
    },
    unmarkedOutfallPipes: {
      unmarkedPipePresent: 2,
      unmarkedPipePresentText: 'No',
    }
  },
  landConditions: {
    shoreLineType: 1,
    shoreLineTypeText: 'Bulkhead/Wall',
    garbage: {
      garbagePresent: 2,
      garbagePresentText: 'No',
    },
    shorelineSurfaceCoverEstPer: {
      imperviousSurfacePer: 35,
      perviousSurfacePer: 30,
      vegetatedSurfacePer: 35
    }
  }
};

// Get the formatted date
var getDate = function(date) {
  return moment(date).format('MMMM D, YYYY');
};

// Get the formatted date
var getShortDate = function(date) {
  return moment(date).format('M/D/YY');
};

// Get the formatted time
var getTime = function(date) {
  return moment(date).format('h:mma');
};

// Get the formatted date and time
var getDateTime = function(date) {
  return moment(date).format('MMM D, YYYY, h:mma');
};

var assertSiteCondition = function() {
  expect(element(by.model('siteCondition.notes')).getAttribute('value')).toEqual(siteCondition1.notes);
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
  element(by.model('siteCondition.notes')).sendKeys(siteCondition1.notes);
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

var assertSiteConditionView = function(values, teamMember) {
  //Meta data
  var members = element.all(by.repeater('member in siteCondition.teamMembers'));
  expect(members.count()).toEqual(1);
  var member = members.get(0);
  expect(member.element(by.binding('member.displayName')).isPresent()).toBe(true);
  expect(member.element(by.binding('member.displayName')).getText()).toEqual(teamMember.displayName);
  if (values.notes) {
    expect(element(by.binding('siteCondition.notes')).isPresent()).toBe(true);
    expect(element(by.binding('siteCondition.notes')).getText()).toEqual('Notes: ' + values.notes);
  }
  //Meteorological conditions
  expect(element(by.binding('siteCondition.meteorologicalConditions.airTemperatureC')).getText())
    .toEqual(values.meteorologicalConditions.weatherConditionsText + ' ' +
    values.meteorologicalConditions.airTemperatureC + '℃\n' +
    values.meteorologicalConditions.humidityPer + '% humidity');
  if (values.recentRainfall.rainedIn24Hours === true) {
    expect(element(by.cssContainingText('.green', 'Rain in the past 24hrs')).isPresent()).toBe(true);
  } else if (values.recentRainfall.rainedIn72Hours === true) {
    expect(element(by.cssContainingText('.green', 'Rain in the past 72hrs')).isPresent()).toBe(true);
  } else if (values.recentRainfall.rainedIn7Days === true) {
    expect(element(by.cssContainingText('.green', 'Rain in the past 7 days')).isPresent()).toBe(true);
  } else {
    expect(element(by.cssContainingText('.green', 'No rain in the past 7 days')).isPresent()).toBe(true);
  }
  expect(element(by.binding('siteCondition.meteorologicalConditions.windSpeedMPH')).getText())
    .toEqual(values.meteorologicalConditions.windSpeedMPH + 'mph\n' +
    values.meteorologicalConditions.windDirectionText + ' wind');
  //Tide Conditions
  expect(element(by.binding('siteCondition.tideConditions.closestHighTideHeight')).getText())
    .toEqual(values.tideConditions.closestHighTideHeight + 'ft, ' +
    getTime(values.tideConditions.closestHighTide) + ' \nClosest high tide on ' +
    getShortDate(values.tideConditions.closestHighTide));
  expect(element(by.binding('siteCondition.tideConditions.closestLowTideHeight')).getText())
    .toEqual(values.tideConditions.closestLowTideHeight + 'ft, ' +
    getTime(values.tideConditions.closestLowTide) + ' \nClosest low tide on ' +
    getShortDate(values.tideConditions.closestLowTide));
  if (values.tideConditions.tidalCurrent === 'flood-current') {
    expect(element(by.cssContainingText('.green', 'Flood current (incoming tide)')).isPresent()).toBe(true);
  } else if (values.tideConditions.tidalCurrent === 'slack-water') {
    expect(element(by.cssContainingText('.green', 'Slack water')).isPresent()).toBe(true);
  } else if (values.tideConditions.tidalCurrent === 'ebb-current') {
    expect(element(by.cssContainingText('.green', 'Ebb current (outgoing tide)')).isPresent()).toBe(true);
  }
  //Water Conditions
  expect(element(by.binding('waterConditionPhotoURL')).isPresent()).toBe(true);
  expect(element(by.binding('siteCondition.waterConditions.surfaceCurrentSpeedMPS')).isPresent())
    .toEqual(values.waterConditions.surfaceCurrentSpeedMPS + ' meters/sec\nSurface current speed');
  expect(element(by.binding('siteCondition.waterConditions.waterColor')).getText())
    .toEqual(values.waterConditions.waterColor + ' water color');

};

module.exports = {
  siteCondition1: siteCondition1,
  siteCondition2: siteCondition2,
  siteCondition3: siteCondition3,
  assertSiteCondition: assertSiteCondition,
  fillOutSiteConditions: fillOutSiteConditions,
  assertSiteConditionView: assertSiteConditionView
};
