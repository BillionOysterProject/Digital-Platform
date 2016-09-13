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
    rainedIn7Days: 2,
    rainedIn7DaysText: 'Yes',
    rainedIn72Hours: 2,
    rainedIn72HoursText: 'Yes',
    rainedIn24Hours: 2,
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
    oilSheen: 2,
    oilSheenText: 'Yes',
    garbage: {
      garbagePresent: 2,
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
      markedCSOPresent: 2,
      markedCSOPresentText: 'Yes',
      flowThroughPresent: 2,
      flowThroughPresentText: 'Yes',
      howMuchFlowThrough: 3,
      howMuchFlowThroughText: 'Steady Stream',
      location: {
        latitude: 39.765,
        longitude: -76.234,
      }
    },
    unmarkedOutfallPipes: {
      unmarkedPipePresent: 2,
      unmarkedPipePresentText: 'Yes',
      flowThroughPresent: 2,
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
      garbagePresent: 2,
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
  meteorologicalConditions: {
    airTemperatureC: 20,
    windSpeedMPH: 3,
    humidityPer: 19,
    weatherConditions: 4,
    weatherConditionsText: 'Rain',
    windDirection: 5,
    windDirectionText: 'South',
    windDirectionAbbr: 'S'
  },
  recentRainfall: {
    rainedIn7Days: 2,
    rainedIn7DaysText: 'Yes',
    rainedIn72Hours: 2,
    rainedIn72HoursText: 'Yes',
    rainedIn24Hours: 2,
    rainedIn24HoursText: 'Yes'
  },
  tideConditions: {
    closestHighTide: '2016-08-23T17:34:00.000Z',
    closestHighTideHeight: 10,
    closestLowTide: '2016-08-23T17:34:00.000Z',
    closestLowTideHeight: 2,
    referencePoint: 'Test reference point 2',
    tidalCurrent: 3,
    tidalCurrentText: 'Ebb current (outgoing tide)'
  },
  waterConditions: {
    surfaceCurrentSpeedMPS: 5,
    waterColor: 1,
    waterColorText: 'Light Blue',
    oilSheen: 2,
    oilSheenText: 'Yes',
    garbage: {
      garbagePresent: 2,
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
      markedCSOPresent: 2,
      markedCSOPresentText: 'Yes',
      flowThroughPresent: 2,
      flowThroughPresentText: 'Yes',
      howMuchFlowThrough: 1,
      howMuchFlowThroughText: 'Trickle',
      location: {
        latitude: 39.765,
        longitude: -76.234,
      }
    },
    unmarkedOutfallPipes: {
      unmarkedPipePresent: 2,
      unmarkedPipePresentText: 'Yes',
      flowThroughPresent: 2,
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
      garbagePresent: 2,
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
  meteorologicalConditions: {
    airTemperatureC: 18,
    windSpeedMPH: 1,
    humidityPer: 12,
    weatherConditions: 5,
    weatherConditionsText: 'Fog',
    windDirection: 7,
    windDirectionText: 'East',
    windDirectionAbbr: 'E'
  },
  recentRainfall: {
    rainedIn7Days: 1,
    rainedIn7DaysText: 'No'
  },
  tideConditions: {
    closestHighTide: '2016-08-25T20:24:00.000Z',
    closestHighTideHeight: 7,
    closestLowTide: '2016-08-25T20:24:00.000Z',
    closestLowTideHeight: 1,
    referencePoint: 'Test reference point 3',
    tidalCurrent: 1,
    tidalCurrentText: 'Flood current (incoming tide)'
  },
  waterConditions: {
    surfaceCurrentSpeedMPS: 4,
    waterColor: 5,
    waterColorText: 'Light Brown',
    oilSheen: 1,
    oilSheenText: 'No',
    garbage: {
      garbagePresent: 1,
      garbagePresentText: 'No'
    },
    markedCombinedSewerOverflowPipes: {
      markedCSOPresent: 1,
      markedCSOPresentText: 'No'
    },
    unmarkedOutfallPipes: {
      unmarkedPipePresent: 1,
      unmarkedPipePresentText: 'No',
    }
  },
  landConditions: {
    shoreLineType: 1,
    shoreLineTypeText: 'Bulkhead/Wall',
    garbage: {
      garbagePresent: 1,
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
  if (values.recentRainfall.rainedIn24Hours === 1) {
    expect(element(by.id('rainedIn24Hours')).isPresent()).toBe(true);
  } else if (values.recentRainfall.rainedIn72Hours === 1) {
    expect(element(by.id('rainedIn72Hours')).isPresent()).toBe(true);
  } else if (values.recentRainfall.rainedIn7Days === 1) {
    expect(element(by.id('rainedIn7Days')).isPresent()).toBe(true);
  } else {
    expect(element(by.id('noRain')).isPresent()).toBe(true);
  }
  expect(element(by.binding('siteCondition.meteorologicalConditions.windSpeedMPH')).getText())
    .toEqual(values.meteorologicalConditions.windSpeedMPH + 'mph\n' +
    values.meteorologicalConditions.windDirectionText + ' wind');
  //Tide Conditions
  expect(element(by.binding('siteCondition.tideConditions.closestHighTideHeight')).getText())
    .toEqual(values.tideConditions.closestHighTideHeight + 'ft, ' +
    getTime(values.tideConditions.closestHighTide) + '\nClosest high tide on ' +
    getShortDate(values.tideConditions.closestHighTide));
  expect(element(by.binding('siteCondition.tideConditions.closestLowTideHeight')).getText())
    .toEqual(values.tideConditions.closestLowTideHeight + 'ft, ' +
    getTime(values.tideConditions.closestLowTide) + '\nClosest low tide on ' +
    getShortDate(values.tideConditions.closestLowTide));
  if (values.tideConditions.tidalCurrent === 'flood-current') {
    expect(element(by.cssContainingText('.green', 'Flood current (incoming tide)')).isPresent()).toBe(true);
  } else if (values.tideConditions.tidalCurrent === 'slack-water') {
    expect(element(by.cssContainingText('.green', 'Slack water')).isPresent()).toBe(true);
  } else if (values.tideConditions.tidalCurrent === 'ebb-current') {
    expect(element(by.cssContainingText('.green', 'Ebb current (outgoing tide)')).isPresent()).toBe(true);
  }
  //Water Conditions
  element(by.id('waterConditionPhoto')).getAttribute('src')
  .then(function(text){
    if (text !== null) {
      expect(text).not.toEqual('');
      expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
    }
  });
  expect(element(by.binding('siteCondition.waterConditions.surfaceCurrentSpeedMPS')).getText())
    .toEqual(values.waterConditions.surfaceCurrentSpeedMPS + ' meters/sec\nSurface current speed');
  expect(element(by.binding('siteCondition.waterConditions.waterColor')).getText())
    .toEqual(values.waterConditions.waterColorText);
  if (values.waterConditions.oilSheen === 1) {
    expect(element(by.id('oilSheen')).isPresent()).toBe(true);
  } else {
    expect(element(by.id('noOilSheen')).isPresent()).toBe(true);
  }
  if (values.waterConditions.garbage.garbagePresent === 1) {
    if (values.waterConditions.garbage.hardPlasticText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.hardPlastic')).getText())
        .toEqual(values.waterConditions.garbage.hardPlasticText + ' amount of hard plastic');
    }
    if (values.waterConditions.garbage.softPlasticText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.softPlastic')).getText())
        .toEqual(values.waterConditions.garbage.softPlasticText + ' amount of soft plastic');
    }
    if (values.waterConditions.garbage.metalText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.metal')).getText())
        .toEqual(values.waterConditions.garbage.metalText + ' amount of metal');
    }
    if (values.waterConditions.garbage.paperText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.paper')).getText())
        .toEqual(values.waterConditions.garbage.paperText + ' amount of paper');
    }
    if (values.waterConditions.garbage.glassText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.glass')).getText())
        .toEqual(values.waterConditions.garbage.glassText + ' amount of glass');
    }
    if (values.waterConditions.garbage.organicText !== 'None') {
      expect(element(by.binding('siteCondition.waterConditions.garbage.organic')).getText())
        .toEqual(values.waterConditions.garbage.organicText + ' amount of organic');
    }
    if (values.waterConditions.garbage.other.extent) {
      expect(element(by.binding('siteCondition.waterConditions.garbage.other.extent')).getText())
        .toEqual(values.waterConditions.garbage.other.extentText + ' amount of ' +
        values.waterConditions.garbage.other.description);
    }
  } else {
    expect(element(by.id('noGarbagePresentWater')).isPresent()).toBe(true);
  }
  if (values.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent === 1) {
    expect(element(by.id('markedCSO')).getText())
      .toEqual('CSO pipes present:\n' +
      'Location at ' + values.waterConditions.markedCombinedSewerOverflowPipes.location.latitude + ', ' +
      values.waterConditions.markedCombinedSewerOverflowPipes.location.longitude + '\n' +
      values.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThroughText);
  } else {
    expect(element(by.id('noMarkedCSO')).isPresent()).toBe(true);
  }
  if(values.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent === 1) {
    expect(element(by.id('unmarkedPipe')).getText())
      .toEqual('Unmarked or other outfall pipes present:\n' +
      'Location at ' + values.waterConditions.unmarkedOutfallPipes.location.latitude + ', ' +
      values.waterConditions.unmarkedOutfallPipes.location.longitude + '\n' +
      values.waterConditions.unmarkedOutfallPipes.howMuchFlowThroughText + '\n' +
      values.waterConditions.unmarkedOutfallPipes.approximateDiameterCM + 'cm approximate diameter');
  } else {
    expect(element(by.id('noUnmarkedPipe')).isPresent()).toBe(true);
  }
  //Land Conditions
  element(by.id('landConditionPhoto')).getAttribute('src')
  .then(function(text){
    if (text !== null) {
      expect(text).not.toEqual('');
      expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
    }
  });
  expect(element(by.binding('siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer')).getText())
    .toEqual(values.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer + '% ' +
    'Impervious Surface (concrete/asphalt paths, roads, buildings etc)');
  expect(element(by.binding('siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer')).getText())
    .toEqual(values.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer + '% ' +
    'Pervious Surface (dirt, gravel etc)');
  expect(element(by.binding('siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer')).getText())
    .toEqual(values.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer + '% ' +
    'Vegetated surface (grass, shrubs, trees)');
  if (values.landConditions.garbage.garbagePresent === 1) {
    if (values.landConditions.garbage.hardPlasticText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.hardPlastic')).getText())
        .toEqual(values.landConditions.garbage.hardPlasticText + ' amount of hard plastic');
    }
    if (values.landConditions.garbage.softPlasticText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.softPlastic')).getText())
        .toEqual(values.landConditions.garbage.softPlasticText + ' amount of soft plastic');
    }
    if (values.landConditions.garbage.metalText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.metal')).getText())
        .toEqual(values.landConditions.garbage.metalText + ' amount of metal');
    }
    if (values.landConditions.garbage.paperText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.paper')).getText())
        .toEqual(values.landConditions.garbage.paperText + ' amount of paper');
    }
    if (values.landConditions.garbage.glassText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.glass')).getText())
        .toEqual(values.landConditions.garbage.glassText + ' amount of glass');
    }
    if (values.landConditions.garbage.organicText !== 'None') {
      expect(element(by.binding('siteCondition.landConditions.garbage.organic')).getText())
        .toEqual(values.landConditions.garbage.organicText + ' amount of organic');
    }
    if (values.landConditions.garbage.other.extent) {
      expect(element(by.binding('siteCondition.landConditions.garbage.other.extent')).getText())
        .toEqual(values.landConditions.garbage.other.extentText + ' amount of ' +
        values.landConditions.garbage.other.description);
    }
  } else {
    expect(element(by.id('noGarbagePresentLand')).isPresent()).toBe(true);
  }
};

var assertSiteConditionCompare = function(index, siteConditionValues) {
  //Meteorological conditions
  if (element(by.id('weather-temperature-compare')).isPresent()) {
    var waterTemperatureRow = element(by.id('weather-temperature-compare')).all(by.tagName('td'));
    var waterTemperature = waterTemperatureRow.get(index);
    expect(waterTemperature.getText()).toEqual(siteConditionValues.meteorologicalConditions.weatherConditionsText + '\n' +
      siteConditionValues.meteorologicalConditions.airTemperatureC + '℃  ');
  }
  if (element(by.id('wind-speed-direction-compare')).isPresent()) {
    var windSpeedDirectionRow = element(by.id('wind-speed-direction-compare')).all(by.tagName('td'));
    var windSpeedDirection = windSpeedDirectionRow.get(index);
    expect(windSpeedDirection.getText()).toEqual(siteConditionValues.meteorologicalConditions.windSpeedMPH + 'mph ' +
      siteConditionValues.meteorologicalConditions.windDirectionText + '  ');
  }
  if (element(by.id('humidity-compare')).isPresent()) {
    var humidityRow = element(by.id('humidity-compare')).all(by.tagName('td'));
    var humidity = humidityRow.get(index);
    expect(humidity.getText()).toEqual(siteConditionValues.meteorologicalConditions.humidityPer + '%  ');
  }
  if (element(by.id('recent-rainfall-compare')).isPresent()) {
    var recentRainfallRow = element(by.id('recent-rainfall-compare')).all(by.tagName('td'));
    var recentRainfall = recentRainfallRow.get(index);
    var recentRainfallString = 'None in the past 7 days';
    if (siteConditionValues.recentRainfall.rainedIn7DaysText === 'Yes' &&
      siteConditionValues.recentRainfall.rainedIn72HoursText === 'Yes' &&
      siteConditionValues.recentRainfall.rainedIn24HoursText === 'Yes') {
      recentRainfallString = 'past 24 hours';
    } else if (siteConditionValues.recentRainfall.rainedIn7DaysText === 'Yes' &&
      siteConditionValues.recentRainfall.rainedIn72HoursText === 'Yes' &&
      (siteConditionValues.recentRainfall.rainedIn24HoursText === 'No' ||
      !siteConditionValues.recentRainfall.rainedIn24HoursText)) {
      recentRainfallString = 'past 72 hours';
    } else if (siteConditionValues.recentRainfall.rainedIn7DaysText === 'Yes' &&
      (siteConditionValues.recentRainfall.rainedIn72HoursText === 'No' ||
      !siteConditionValues.recentRainfall.rainedIn72HoursText) &&
      (siteConditionValues.recentRainfall.rainedIn24HoursText === 'No' ||
      !siteConditionValues.recentRainfall.rainedIn24HoursText)) {
      recentRainfallString = 'past 7 days';
    }
    expect(recentRainfall.getText()).toEqual(recentRainfallString);
  }
  if (element(by.id('tide-compare')).isPresent()) {
    var tideRow = element(by.id('tide-compare')).all(by.tagName('td'));
    var tide = tideRow.get(index);
    expect(tide.getText()).toEqual('Closest high tide: ' +
    siteConditionValues.tideConditions.closestHighTideHeight + 'ft at ' +
    getTime(siteConditionValues.tideConditions.closestHighTide) + ' ' +
    getShortDate(siteConditionValues.tideConditions.closestHighTide) + '\n' + 'Closest low tide: ' +
    siteConditionValues.tideConditions.closestLowTideHeight + 'ft at ' +
    getTime(siteConditionValues.tideConditions.closestLowTide) + ' ' +
    getShortDate(siteConditionValues.tideConditions.closestLowTide));
  }
  if (element(by.id('reference-point-compare')).isPresent()) {
    var referencePointRow = element(by.id('reference-point-compare')).all(by.tagName('td'));
    var referencePoint = referencePointRow.get(index);
    expect(referencePoint.getText()).toEqual(siteConditionValues.tideConditions.referencePoint + ' ');
  }
  if (element(by.id('tidal-current-compare')).isPresent()) {
    var tidalCurrentRow = element(by.id('tidal-current-compare')).all(by.tagName('td'));
    var tidalCurrent = tidalCurrentRow.get(index);
    var tidalCurrentString = '';
    if (siteConditionValues.tideConditions.tidalCurrent === 1) {
      tidalCurrentString = 'Flood current';
    } else if (siteConditionValues.tideConditions.tidalCurrent === 2) {
      tidalCurrentString = 'Slack water';
    } else if (siteConditionValues.tideConditions.tidalCurrent === 3) {
      tidalCurrentString = 'Ebb current';
    }
    expect(tidalCurrent.getText()).toEqual(tidalCurrentString + '  ');
  }
  if (element(by.id('surface-current-speed-compare')).isPresent()) {
    var surfaceCurrentSpeedRow = element(by.id('surface-current-speed-compare')).all(by.tagName('td'));
    var surfaceCurrentSpeed = surfaceCurrentSpeedRow.get(index);
    expect(surfaceCurrentSpeed.getText()).toEqual(siteConditionValues.waterConditions.surfaceCurrentSpeedMPS + ' meters/sec  ');
  }
  if (element(by.id('water-color-compare')).isPresent()) {
    var waterColorRow = element(by.id('water-color-compare')).all(by.tagName('td'));
    var waterColor = waterColorRow.get(index);
    expect(waterColor.getText()).toEqual(siteConditionValues.waterConditions.waterColorText + ' ');
  }
  if (element(by.id('oil-sheen-compare')).isPresent()) {
    var oilSheenRow = element(by.id('oil-sheen-compare')).all(by.tagName('td'));
    var oilSheen = oilSheenRow.get(index);
    expect(oilSheen.getText()).toEqual(siteConditionValues.waterConditions.oilSheenText + '  ');
  }
  if (element(by.id('garbage-water-compare')).isPresent()) {
    var garbageWaterRow = element(by.id('garbage-water-compare')).all(by.tagName('td'));
    var garbageWater = garbageWaterRow.get(index);
    if (siteConditionValues.waterConditions.garbage.garbagePresentText === 'No') {
      expect(garbageWater.getText()).toEqual(siteConditionValues.waterConditions.garbage.garbagePresentText);
    } else {
      var garbageWaterString = 'Yes:\n';
      if (siteConditionValues.waterConditions.garbage.hardPlasticText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.hardPlasticText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.hardPlasticText + ' amount of hard plastic,\n';
      }
      if (siteConditionValues.waterConditions.garbage.softPlasticText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.softPlasticText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.softPlasticText + ' amount of soft plastic,\n';
      }
      if (siteConditionValues.waterConditions.garbage.metalText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.metalText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.metalText + ' amount of metal,\n';
      }
      if (siteConditionValues.waterConditions.garbage.paperText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.paperText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.paperText + ' amount of paper,\n';
      }
      if (siteConditionValues.waterConditions.garbage.glassText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.glassText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.glassText + ' amount of glass,\n';
      }
      if (siteConditionValues.waterConditions.garbage.organicText) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.organicText === 'None') ? '\n' :
          siteConditionValues.waterConditions.garbage.organicText + ' amount of organic,\n';
      }
      if (siteConditionValues.waterConditions.garbage.other.description) {
        garbageWaterString += (siteConditionValues.waterConditions.garbage.other.extentText === 'None') ? '' :
          siteConditionValues.waterConditions.garbage.other.extentText + ' amount of ' +
          siteConditionValues.waterConditions.garbage.other.description + '';
      }
      expect(garbageWater.getText()).toEqual(garbageWaterString);
    }
  }
  if (element(by.id('pipes-compare')).isPresent()) {
    var pipesRow = element(by.id('pipes-compare')).all(by.tagName('td'));
    var pipes = pipesRow.get(index);
    var csoString = '';
    if (siteConditionValues.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresentText === 'No') {
      csoString = 'No CSO pipes\n\n';
    } else {
      csoString = 'CSO pipes present:\n' + 'Location at ' +
      siteConditionValues.waterConditions.markedCombinedSewerOverflowPipes.location.latitude + ', ' +
      siteConditionValues.waterConditions.markedCombinedSewerOverflowPipes.location.longitude + '\n' +
      'Flow: ' + siteConditionValues.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThroughText;
    }
    var unmarkedString = '';
    if (siteConditionValues.waterConditions.unmarkedOutfallPipes.unmarkedPipePresentText === 'No') {
      unmarkedString = 'No unmarked or other outfall pipes';
    } else {
      unmarkedString = 'Unmarked or other outfall pipes present:\n' + 'Location at ' +
      siteConditionValues.waterConditions.unmarkedOutfallPipes.location.latitude + ', ' +
      siteConditionValues.waterConditions.unmarkedOutfallPipes.location.longitude + '\n' +
      'Flow: ' + siteConditionValues.waterConditions.unmarkedOutfallPipes.howMuchFlowThroughText + '\n' +
      siteConditionValues.waterConditions.unmarkedOutfallPipes.approximateDiameterCM + 'cm approximate diameter';
    }
    expect(pipes.getText()).toEqual(csoString + '\n' + unmarkedString);
  }
  if (element(by.id('shoreline-type-compare')).isPresent()) {
    var shorelineTypeRow = element(by.id('shoreline-type-compare')).all(by.tagName('td'));
    var shorelineType = shorelineTypeRow.get(index);
    expect(shorelineType.getText()).toEqual(siteConditionValues.landConditions.shoreLineTypeText + ' ');
  }
  if (element(by.id('garbage-land-compare')).isPresent()) {
    var garbageLandRow = element(by.id('garbage-land-compare')).all(by.tagName('td'));
    var garbageLand = garbageLandRow.get(index);
    if (siteConditionValues.landConditions.garbage.garbagePresentText === 'No') {
      expect(garbageLand.getText()).toEqual(siteConditionValues.landConditions.garbage.garbagePresentText);
    } else {
      var garbageLandString = 'Yes:\n';
      if (siteConditionValues.landConditions.garbage.hardPlasticText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.hardPlasticText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.hardPlasticText + ' amount of hard plastic,\n';
      }
      if (siteConditionValues.landConditions.garbage.softPlasticText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.softPlasticText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.softPlasticText + ' amount of soft plastic,\n';
      }
      if (siteConditionValues.landConditions.garbage.metalText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.metalText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.metalText + ' amount of metal,\n';
      }
      if (siteConditionValues.landConditions.garbage.paperText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.paperText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.paperText + ' amount of paper,\n';
      }
      if (siteConditionValues.landConditions.garbage.glassText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.glassText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.glassText + ' amount of glass,\n';
      }
      if (siteConditionValues.landConditions.garbage.organicText) {
        garbageLandString += (siteConditionValues.landConditions.garbage.organicText === 'None') ? '\n' :
          siteConditionValues.landConditions.garbage.organicText + ' amount of organic,\n';
      }
      if (siteConditionValues.landConditions.garbage.other.description) {
        garbageLandString += (siteConditionValues.landConditions.garbage.other.extentText === 'None') ? '' :
          siteConditionValues.landConditions.garbage.other.extentText + ' amount of ' +
          siteConditionValues.landConditions.garbage.other.description + '';
      }
      expect(garbageLand.getText()).toEqual(garbageLandString);
    }
  }
  if (element(by.id('surface-cover-compare')).isPresent()) {
    var surfaceCoverRow = element(by.id('surface-cover-compare')).all(by.tagName('td'));
    var surfaceCover = surfaceCoverRow.get(index);
    expect(surfaceCover.getText()).toEqual(
      siteConditionValues.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer + '% Impervious Surface\n' +
      siteConditionValues.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer + '% Pervious Surface\n' +
      siteConditionValues.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer + '% Vegetated Surface');
  }
};

module.exports = {
  siteCondition1: siteCondition1,
  siteCondition2: siteCondition2,
  siteCondition3: siteCondition3,
  assertSiteCondition: assertSiteCondition,
  fillOutSiteConditions: fillOutSiteConditions,
  assertSiteConditionView: assertSiteConditionView,
  assertSiteConditionCompare: assertSiteConditionCompare
};
