'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates;

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
    unitsText: 'mg/L (ppm)',
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
    unitsText: 'cm',
    results: [55.3, 51.1, 53.8],
    average: '53.4'
  },
  ammonia: {
    method: 2,
    methodText: 'Photometer',
    units: 1,
    unitsText: 'ppm',
    results: [61.4, 63.3, 67.5],
    average: '64.07'
  },
  nitrates: {
    method: 2,
    methodText: 'Photometer',
    units: 1,
    unitsText: 'ppm',
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
    unitsText: 'cm',
    results: [50.9, 52.4, 53.1],
    average: '52.13'
  },
  ammonia: {
    method: 1,
    methodText: 'Test strips',
    units: 1,
    unitsText: 'ppm',
    results: [60.3, 64.1, 63.4],
    average: '62.6'
  },
  nitrates: {
    method: 1,
    methodText: 'Test strips',
    units: 1,
    unitsText: 'ppm',
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

var waterQuality3 = {
  depthOfWaterSampleM: 5,
  waterTemperature: {
    method: 1,
    methodText: 'Digital thermometer',
    units: 2,
    unitsText: 'C',
    results: [17.5, 13.9, 12.8],
    average: '14.73'
  },
  dissolvedOxygen: {
    method: 2,
    methodText: 'Sensor',
    units: 1,
    unitsText: 'mg/L (ppm)',
    results: [23.8, 21.9, 22.4],
    average: '22.7'
  },
  salinity: {
    method: 1,
    methodText: 'Hydrometer',
    units: 1,
    unitsText: 'PPT',
    results: [33.5, 31.9, 30.9],
    average: '32.1'
  },
  pH: {
    method: 2,
    methodText: 'Sensor (read only)',
    units: 1,
    unitsText: 'pH (logscale)',
    results: [44.4, 40.9, 42.1],
    average: '42.47'
  },
  turbidity: {
    method: 1,
    methodText: 'Turbidity tube',
    units: 1,
    unitsText: 'cm',
    results: [56.1, 52.8, 54.7],
    average: '54.53'
  },
  ammonia: {
    method: 2,
    methodText: 'Photometer',
    units: 1,
    unitsText: 'ppm',
    results: [65.2, 61.4, 62.8],
    average: '63.13'
  },
  nitrates: {
    method: 2,
    methodText: 'Photometer',
    units: 1,
    unitsText: 'ppm',
    results: [72.3, 71.9, 74.5],
    average: '72.9'
  }
};

var waterQuality4 = {
  depthOfWaterSampleM: 7,
  waterTemperature: {
    method: 2,
    methodText: 'Analog thermometer',
    units: 1,
    unitsText: 'F',
    results: [12.8, 11.9, 14.4],
    average: '13.03'
  },
  dissolvedOxygen: {
    method: 3,
    methodText: 'Winkler',
    units: 2,
    unitsText: '% saturation',
    results: [24.8, 21.9, 25.5],
    average: '24.07'
  },
  salinity: {
    method: 3,
    methodText: 'Sensor',
    units: 1,
    unitsText: 'PPT',
    results: [32.8, 35.6, 31.9],
    average: '33.43'
  },
  pH: {
    method: 3,
    methodText: 'Sensor',
    units: 1,
    unitsText: 'pH (logscale)',
    results: [43.9, 41.8, 45.6],
    average: '43.77'
  }
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

var fillOutWaterQuality = function() {
  // Fill in values
  var samples = element.all(by.repeater('sample in waterQuality.samples'));
  var sample1 = samples.get(0);
  fillOutWaterQualitySample(sample1, 0, waterQuality1);

  element(by.css('a[ng-click="addSampleForm()"]')).click();
  samples = element.all(by.repeater('sample in waterQuality.samples'));
  var sample2 = samples.get(1);
  fillOutWaterQualitySample(sample2, 1, waterQuality2);
};

var assertWaterSampleView = function(index, values) {
  var sample = values.samples[index];
  var sampleElement = element(by.id('waterQualitySample'+index));

  expect(sample.element(by.binding('sample.depthOfWaterSampleM')).getText())
    .toEqual(sample.depthOfWaterSampleM + ' meters deep');
  if (sample.waterTemperature.unitsText === 'C') {
    expect(sample.element(by.binding('sample.waterTemperature.average')).getText())
      .toEqual(sample.waterTemperature.average + '℃');
  } else if (sample.waterTemperature.unitsText === 'F') {
    expect(sample.element(by.binding('sample.waterTemperature.average')).getText())
      .toEqual(sample.waterTemperature.average + '℉');
  }
  expect(sample.element(by.binding('sample.waterTemperature.method')).getText())
    .toEqual('via ' + sample.waterTemperature.methodText.toLowerCase());

  expect(sample.element(by.binding('sample.dissolvedOxygen.average')).getText())
    .toEqual(sample.dissolvedOxygen.average + ' ' + sample.dissolvedOxygen.unitsText + '\n' +
    'via ' + sample.dissolvedOxygen.methodText.toLowerCase());

  expect(sample.element(by.binding('sample.salinity.average')).getText())
    .toEqual(sample.salinity.average + ' ' + sample.salinity.unitsText + '\n' +
    'via ' + sample.salinity.methodText.toLowerCase());

  expect(sample.element(by.binding('sample.pH.average')).getText())
    .toEqual(sample.pH.average + ' ' + sample.pH.unitsText + '\n' +
    'via ' + sample.pH.methodText.toLowerCase());

  if (sample.turbidity.average) {
    expect(sample.element(by.binding('sample.turbidity.average')).getText())
      .toEqual(sample.turbidity.average + ' ' + sample.turbidity.unitsText + '\n' +
      'via ' + sample.turbidity.methodText.toLowerCase());
  }

  if (sample.ammonia.average) {
    expect(sample.element(by.binding('sample.ammonia.average')).getText())
      .toEqual(sample.ammonia.average + ' ' + sample.ammonia.unitsText + '\n' +
      'via ' + sample.ammonia.methodText.toLowerCase());
  }

  if (sample.nitrates.average) {
    expect(sample.element(by.binding('sample.nitrates.average')).getText())
      .toEqual(sample.nitrates.average + ' ' + sample.nitrates.unitsText + '\n' +
      'via ' + sample.nitrates.methodText.toLowerCase());
  }

  if (sample.others[0].average) {
    expect(sample.element(by.binding('sample.others[0].average')).getText())
      .toEqual(sample.others[0].average + ' ' + sample.others[0].unitsText + '\n' +
      'via ' + sample.others[0].methodText.toLowerCase());
  }
};

var assertWaterQualityView = function(values, teamMember) {
  //Meta data
  var members = element.all(by.repeater('member in waterQuality.teamMembers'));
  expect(members.count()).toEqual(1);
  var member = members.get(0);
  expect(member.element(by.binding('member.displayName')).isPresent()).toBe(true);
  expect(member.element(by.binding('member.displayName')).getText()).toEqual(teamMember.displayName);
  if (values.notes) {
    expect(element(by.binding('waterQuality.notes')).isPresent()).toBe(true);
    expect(element(by.binding('waterQuality.notes')).getText()).toEqual('Notes: ' + values.notes);
  }
};

var assertWaterQualityCompare = function(index, values) {
  if (element(by.id('depth-of-water-sample-compare')).isPresent()) {
    var depthRow = element(by.id('depth-of-water-sample-compare')).all(by.tagName('td'));
    var depth = depthRow.get(index);
    expect(depth.getText()).toEqual(values.depthOfWaterSampleM + ' meters ');
  }
  if (element(by.id('water-temperature-compare')).isPresent()) {
    var waterTemperatureRow = element(by.id('water-temperature-compare')).all(by.tagName('td'));
    var waterTemperature = waterTemperatureRow.get(index);
    var tempF = 0;
    var tempC = 0;
    if (values.waterTemperature.unitsText === 'C') {
      tempF = (values.waterTemperature.average * 9/5 + 32);
      tempC = values.waterTemperature.average;
    }
    if (values.waterTemperature.unitsText === 'F') {
      tempC = (values.waterTemperature.average - 32) / 1.8;
      tempF = values.waterTemperature.average;
    }
    tempF = parseFloat(tempF).toFixed(2);
    tempC = parseFloat(tempC).toFixed(2);
    expect(waterTemperature.getText()).toEqual(tempF + '℉ / ' + tempC + '℃  ');
  }
  if (element(by.id('dissolved-oxygen-compare')).isPresent()) {
    var dissolvedOxygenRow = element(by.id('dissolved-oxygen-compare')).all(by.tagName('td'));
    var dissolvedOxygen = dissolvedOxygenRow.get(index);
    var dissolvedOxygenAverage = parseFloat(values.dissolvedOxygen.average).toFixed(2);
    expect(dissolvedOxygen.getText()).toEqual(dissolvedOxygenAverage + ' ' +
      values.dissolvedOxygen.unitsText + '  ');
  }
  if (element(by.id('salinity-compare')).isPresent()) {
    var salinityRow = element(by.id('salinity-compare')).all(by.tagName('td'));
    var salinity = salinityRow.get(index);
    var salinityAverage = parseFloat(values.salinity.average).toFixed(2);
    expect(salinity.getText()).toEqual(salinityAverage + ' ' +
      values.salinity.unitsText + '  ');
  }
  if (element(by.id('pH-compare')).isPresent()) {
    var phRow = element(by.id('pH-compare')).all(by.tagName('td'));
    var ph = phRow.get(index);
    var phAverage = parseFloat(values.pH.average).toFixed(2);
    expect(ph.getText()).toEqual(phAverage + ' ' +
      values.pH.unitsText + '  ');
  }
};

module.exports = {
  waterQuality1: waterQuality1,
  waterQuality2: waterQuality2,
  waterQuality3: waterQuality3,
  waterQuality4: waterQuality4,
  assertWaterQualitySample: assertWaterQualitySample,
  assertWaterQuality: assertWaterQuality,
  fillOutWaterQualitySample: fillOutWaterQualitySample,
  fillOutWaterQuality: fillOutWaterQuality,
  assertWaterQualityView: assertWaterQualityView,
  assertWaterQualityCompare: assertWaterQualityCompare
};
