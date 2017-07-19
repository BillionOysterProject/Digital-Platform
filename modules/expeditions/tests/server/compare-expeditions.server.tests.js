'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  express = require(path.resolve('./config/lib/express')),
  CommonUser = require('../../../users/tests/e2e/common-users.e2e.tests');

var leader = CommonUser.leader;
var member1 = CommonUser.member1;
var member2 = CommonUser.member2;
var team = CommonUser.team;
var organization = CommonUser.organization;
var station = CommonUser.station;
var station2 = CommonUser.station2;

var expedition1 = { name: 'Test Expedition 1 - Auto Assign' };
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
      photoPresent: true,
      measurements: [{
      }]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 11,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 2',
      photoPresent: true,
      measurements: [11.1]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 12,
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 3',
      photoPresent: false,
      measurements: [23.1, 21.0]
    }, {
      source: 4,
      sourceText: 'Bronx River, New York',
      totalNumberOfLiveOystersAtBaseline: 13,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 4',
      photoPresent: true,
      measurements: [32.1, 33.1, 38.2]
    }, {
      source: 5,
      sourceText: 'Tappan Zee, New York',
      totalNumberOfLiveOystersAtBaseline: 14,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 5',
      photoPresent: true,
      measurements: [43.1, 40.1, 47.3, 44.2]
    }, {
      source: 6,
      sourceText: 'Hudson River, New York',
      totalNumberOfLiveOystersAtBaseline: 15,
      totalNumberOfLiveOystersOnShell: 5,
      totalMassOfScrubbedSubstrateShellOystersTagG: 50,
      notes: 'Test notes 6',
      photoPresent: false,
      measurements: [53.2, 52.1, 55.2, 58.4, 57.2]
    }, {
      source: 7,
      sourceText: 'Other',
      otherSource: 'Other Test',
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 4,
      totalMassOfScrubbedSubstrateShellOystersTagG: 40,
      notes: 'Test notes 7',
      photoPresent: true,
      measurements: [65.2, 66.3, 62.1, 67.4]
    }, {
      source: 1,
      sourceText: 'Muscongus Bay, Maine',
      totalNumberOfLiveOystersAtBaseline: 17,
      totalNumberOfLiveOystersOnShell: 3,
      totalMassOfScrubbedSubstrateShellOystersTagG: 30,
      notes: 'Test notes 8',
      photoPresent: true,
      measurements: [77.3, 74.2, 72.1]
    }, {
      source: 2,
      sourceText: 'Fishers Island, New York',
      totalNumberOfLiveOystersAtBaseline: 18,
      totalNumberOfLiveOystersOnShell: 2,
      totalMassOfScrubbedSubstrateShellOystersTagG: 20,
      notes: 'Test notes 9',
      photoPresent: false,
      measurements: [88.3, 84.3]
    }, {
      source: 3,
      sourceText: 'Soundview, New York',
      totalNumberOfLiveOystersAtBaseline: 19,
      totalNumberOfLiveOystersOnShell: 1,
      totalMassOfScrubbedSubstrateShellOystersTagG: 10,
      notes: 'Test notes 10',
      photoPresent: true,
      measurements: [93.2]
    }]
  }
};
var mobileTrap1 = {
  organismDetails: {
    notes: 'Test organism details'
  },
  count: 1,
  organism: {
    commonName: 'Other/Unknown',
    latinName: 'Unlisted organism'
  },
  photoPresent: true
};
var mobileTrap2 = {
  organismDetails: {
    notes: 'Test organism details2'
  },
  count: 1,
  organism: {
    commonName: 'Black-fingered mud crab',
    latinName: 'Panopeus herbstii'
  },
  photoPresent: false
};
var settlementTiles1 = {
  settlementTile1: {
    description: 'Test description 1a',
    organisms: [2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    organismsText: ['Boring sponges','Boring sponges','Bushy brown bryozoan','Chain tunicate',
      'Conopeum bryozoans','Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian',
      'Hard tube worms','Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm',
      'Northern red anemone','Northern rock barnacle','Orange bryozoan','Orange sheath tunicate',
      'Oyster drill','Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase',
      'Slipper snails','Tube-building polychaete']
  },
  settlementTile2: {
    description: 'Test description 1b',
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
    description: 'Test description 1c',
    organisms: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2],
    organismsText: ['Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans','Eastern mudsnail',
      'Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms','Hydroids',
      'Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges'],
    notes: 'Notes 2'
  },
  settlementTile4: {
    description: 'Test description 1d',
    organisms: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2,2],
    organismsText: ['Chain tunicate','Conopeum bryozoans','Eastern mudsnail','Frilled anemone',
      'Golden star tunicate, star ascidian','Hard tube worms','Hydroids','Ivory barnacle',
      'Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges','Boring sponges'],
    notes: 'Notes 3'
  }
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

var expedition2 = {
  name: 'Test Expedition 2 - Fully Filled Out',
  notes: 'Test special instructions',
  monitoringStartDate: '2016-08-24T14:00:00.000Z',
  _id: '57bf2bcdd9bd331294fdf6c8'
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
      photoPresent: true,
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
      photoPresent: true,
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
      photoPresent: true,
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
      totalNumberOfLiveOystersAtBaseline: 14,
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
      totalNumberOfLiveOystersAtBaseline: 16,
      totalNumberOfLiveOystersOnShell: 16,
      totalMassOfScrubbedSubstrateShellOystersTagG: '160.00',
      notes: 'Test notes 7a',
      photoPresent: true,
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
      photoPresent: true,
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
      photoPresent: true,
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
      photoPresent: true,
      averageSizeOfLiveOysters: '93.31',
      minimumSizeOfLiveOysters: '90.00',
      maximumSizeOfLiveOysters: '96.10',
      measurements: [93.2,90.9,93.3,94.4,91.8,94.7,95.7,91.1,93.5,94.5,95.7,
        93.4,92.2,93.6,90.0,92.5,96.1,93.7,92.6]
    }]
  }
};
var mobileTrap3 = {
  organismDetails: {
    notes: 'Test organism details3'
  },
  count: 2,
  organism: {
    commonName: 'Blackfish, Tautog',
    latinName: 'Tautoga onitis'
  },
  photoPresent: true
};
var settlementTiles2 = {
  settlementTile1: {
    description: 'Test description 2a',
    organisms: [2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    organismsText: ['Boring sponges','Boring sponges','Bushy brown bryozoan','Chain tunicate',
      'Conopeum bryozoans','Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian',
      'Hard tube worms','Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm',
      'Northern red anemone','Northern rock barnacle','Orange bryozoan','Orange sheath tunicate',
      'Oyster drill','Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase',
      'Slipper snails','Tube-building polychaete']
  },
  settlementTile2: {
    description: 'Test description 2b',
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
    description: 'Test description 2c',
    organisms: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2],
    organismsText: ['Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans','Eastern mudsnail',
      'Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms','Hydroids',
      'Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges'],
    notes: 'Notes 2'
  },
  settlementTile4: {
    description: 'Test description 2d',
    organisms: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2,2],
    organismsText: ['Chain tunicate','Conopeum bryozoans','Eastern mudsnail','Frilled anemone',
      'Golden star tunicate, star ascidian','Hard tube worms','Hydroids','Ivory barnacle',
      'Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges','Boring sponges'],
    notes: 'Notes 3'
  }
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

var expedition3 = {
  name: 'Test Expedition 3 - Only Required Filled Out',
  monitoringStartDate: '2016-08-22T14:00:00.000Z',
  _id: '57bf2becd9bd331294fdf6ce'
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
      totalNumberOfLiveOystersAtBaseline: 10,
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
var mobileTrap4 = {
  organismDetails: {
    notes: 'Test organism details4'
  },
  count: 1,
  organism: {
    commonName: 'Blue crab',
    latinName: 'Callinectes sapidus'
  },
  photoPresent: false
};
var settlementTiles3 = {
  settlementTile1: {
    description: 'Test description 3a',
    organisms: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    organismsText: ['Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel']
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


/**
 * Globals
 */
var app,
  agent,
  user;


/**
 * Compare Expedition routes tests
 */
describe('Compare Expedition routes tests', function() {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  it('should be able to download a Expedition compare if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send({
        username: member1.username,
        password: member1.password
      })
      .expect(200)
      .end(function (signinErr, sigininRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/expeditions/export-compare')
          .send({
            expeditionIds: [expedition2._id, expedition3._id],
            protocol1: {
              weatherTemperature: 'YES',
              windSpeedDirection: 'YES',
              humidity: 'YES',
              recentRainfall: 'YES',
              tide: 'YES',
              referencePoint: 'YES',
              tidalCurrent: 'YES',
              surfaceCurrentSpeed: 'YES',
              waterColor: 'YES',
              oilSheen: 'YES',
              garbageWater: 'YES',
              pipes: 'YES',
              shorelineType: 'YES',
              garbageLand: 'YES',
              surfaceCover: 'YES'
            },
            protocol2: {
              submergedDepth: 'YES',
              bioaccumulationOnCage: 'YES',
              cageDamage: 'YES',
              oysterMeasurements: 'YES'
            },
            protocol3: {
              organism: 'YES'
            },
            protocol4: {
              description: 'YES',
              organism: 'YES'
            },
            protocol5: {
              depth: 'YES',
              temperature: 'YES',
              dissolvedOxygen: 'YES',
              salinity: 'YES',
              pH: 'YES',
              turbidity: 'YES',
              ammonia: 'YES',
              nitrates: 'YES',
              other: 'YES'
            }
          })
          .expect(200)
          .end(function (downloadErr, downloadRes) {
            // Handle Download Expedition Compare save error
            if (downloadErr) {
              return done(downloadErr);
            }

            var csv = downloadRes.body;

            done();
          });
      });
  });
});
