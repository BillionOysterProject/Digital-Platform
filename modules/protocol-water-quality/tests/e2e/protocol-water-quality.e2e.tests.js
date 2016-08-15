'use strict';

var EC = protractor.ExpectedConditions,
  CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests');

describe('Protocol Water Quality', function() {



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
    CommonExpedition.assertMapCoordinates('modal-map-sample'+index);
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

});
