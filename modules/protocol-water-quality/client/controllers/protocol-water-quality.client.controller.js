(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityController', ProtocolWaterQualityController);

  ProtocolWaterQualityController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment', '$timeout',
  'lodash', 'Authentication', 'ProtocolWaterQualityService', 'TeamMembersService'];

  function ProtocolWaterQualityController($scope, $rootScope, $state, $stateParams, $http, moment, $timeout,
    lodash, Authentication, ProtocolWaterQualityService, TeamMembersService) {
    var wq = this;

    wq.waterTemperatureMethods = [
      { name: 'Digital thermometer', value: 'digitalThermometer' },
      { name: 'Analog thermometer', value: 'analogThermometer' },
      { name: 'Sensor*', value: 'sensor' }
    ];

    wq.dissolvedOxygenMethods = [
      { name: 'Colormetric ampules', value: 'colormetricvAmpules' },
      { name: 'Sensor', value: 'sensor' },
      { name: 'Winkler', value: 'winkler' }
    ];

    wq.salinityMethods = [
      { name: 'Hydrometer', value: 'hydrometer' },
      { name: 'Refractometer', value: 'refractometer' },
      { name: 'Sensor', value: 'sensor' }
    ];

    wq.pHMethods = [
      { name: 'Test strips', value: 'testStrips' },
      { name: 'Sensor (read only)', value: 'sensorRO' },
      { name: 'Sensor', value: 'sensor' }
    ];

    wq.turbidityMethods = [
      { name: 'Turbidity tube', value: 'turbidityTube' }
    ];

    wq.ammoniaMethods = [
      { name: 'Test strips', value: 'testStrips' },
      { name: 'Photometer', value: 'photometer' }
    ];

    wq.nitratesMethods = [
      { name: 'Test strips', value: 'testStrips' },
      { name: 'Photometer', value: 'photometer' }
    ];

    wq.waterTemperatureUnits = [
      { name: 'F', value: 'f' },
      { name: 'C', value: 'c' }
    ];

    wq.dissolvedOxygenUnits = [
      { name: 'mg/L (PPM)', value: 'mgl' },
      { name: '% saturation', value: 'saturation' }
    ];

    wq.salinityUnits = [
      { name: 'PPT', value: 'ppt' }
    ];

    wq.pHUnits = [
      { name: 'pH (logscale)', value: 'pHlogscale' }
    ];

    wq.turbidityUnits = [
      { name: 'CM', value: 'cm' }
    ];

    wq.ammoniaUnits = [
      { name: 'PPM', value: 'ppm' }
    ];

    wq.nitratesUnits = [
      { name: 'PPM', value: 'ppm' }
    ];

    var average = function(result0, result1, result2) {
      var average = 0;
      var divBy = 0;
      if (result0) {
        average += result0;
        divBy += 1;
      }
      if (result1) {
        average += result1;
        divBy += 1;
      }
      if (result2) {
        average += result2;
        divBy += 1;
      }

      if (average && divBy) {
        return (average / divBy);
      } else {
        return 0;
      }
    };

    wq.waterTemperatureAverage = function(sample) {
      sample.waterTemperature.average = average(sample.waterTemperature.results[0], sample.waterTemperature.results[1],
        sample.waterTemperature.results[2]);
    };

    wq.dissolvedOxygenAverage = function(sample) {
      sample.dissolvedOxygen.average = average(sample.dissolvedOxygen.results[0], sample.dissolvedOxygen.results[1],
        sample.dissolvedOxygen.results[2]);
    };

    wq.salinityAverage = function(sample) {
      sample.salinity.average = average(sample.salinity.results[0], sample.salinity.results[1],
        sample.salinity.results[2]);
    };

    wq.pHAverage = function(sample) {
      sample.pH.average = average(sample.pH.results[0], sample.pH.results[1], sample.pH.results[2]);
    };

    wq.turbidityAverage = function(sample) {
      sample.turbidity.average = average(sample.turbidity.results[0], sample.turbidity.results[1],
        sample.turbidity.results[2]);
    };

    wq.ammoniaAverage = function(sample) {
      sample.ammonia.average = average(sample.ammonia.results[0], sample.ammonia.results[1],
        sample.ammonia.results[2]);
    };

    wq.nitratesAverage = function(sample) {
      sample.nitrates.average = average(sample.nitrates.results[0], sample.nitrates.results[1],
        sample.nitrates.results[2]);
    };

    wq.otherAverage = function(other) {
      other.average = average(other.results[0], other.results[1], other.results[2]);
    };

    var updateAverages = function() {
      for (var i = 0; i < wq.protocolWaterQuality.samples.length; i++) {
        var sample = wq.protocolWaterQuality.samples[i];
        wq.waterTemperatureAverage(sample);
        wq.dissolvedOxygenAverage(sample);
        wq.salinityAverage(sample);
        wq.pHAverage(sample);
        wq.turbidityAverage(sample);
        wq.ammoniaAverage(sample);
        wq.nitratesAverage(sample);

        for (var j = 0; j < sample.others.length; j++) {
          var other = sample.others[j];
          wq.otherAverage(other);
        }
      }
    };

    $scope.$on('saveValuesToScope', function() {
      $scope.protocolWaterQuality = wq.protocolWaterQuality;
    });

    $scope.$on('incrementalSaveWaterQuality', function() {
      wq.saveOnBlur();
    });

    wq.saveOnBlur = function() {
      if (wq.protocolWaterQuality._id && ((wq.form && wq.form.waterQualityForm &&
        wq.form.waterQualityForm.$touched && wq.form.waterQualityForm.$dirty) ||
        (wq.form && wq.form.waterQualityForm && wq.form.waterQualityForm.$valid) ||
        (wq.protocolWaterQuality.samples && wq.protocolWaterQuality.samples.length > 0 &&
        wq.protocolWaterQuality.samples[0].depthOfWaterSampleM))) {
        $rootScope.$broadcast('savingStart');
        updateAverages();
        console.log('incremental-save', wq.protocolWaterQuality);
        $http.post('/api/protocol-water-quality/' + wq.protocolWaterQuality._id + '/incremental-save',
        wq.protocolWaterQuality)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            wq.error = data.errors;
            console.log('success wq.error', wq.error);
            if (wq.form && wq.form.waterQualityForm) wq.form.waterQualityForm.$setSubmitted(true);
            $scope.protocolWaterQuality = wq.protocolWaterQuality;
            $rootScope.$broadcast('incrementalSaveWaterQualityError');
          } else if (data.scribe) {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Water Quality',
                protocol: 'protocol5'
              }
            });
            $scope.protocolWaterQuality = null;
          } else if (data.successful) {
            wq.error = null;
            $scope.protocolWaterQuality = wq.protocolWaterQuality;
            $rootScope.$broadcast('incrementalSaveWaterQualitySuccessful');
          }
          $rootScope.$broadcast('savingStop');
        })
        .error(function (data, status, headers, config) {
          wq.error = data.message;
          console.log('error wq.error', wq.error);
          if (wq.form && wq.form.waterQualityForm) wq.form.waterQualityForm.$setSubmitted(true);
          $rootScope.$broadcast('incrementalSaveWaterQualityError');
          $rootScope.$broadcast('savingStop');
        });
      }
    };

    wq.addSampleForm = function () {
      if (wq.form && wq.form.waterQualityForm) {
        wq.form.waterQualityForm.$setSubmitted(false);
        wq.form.waterQualityForm.$setPristine(true);
      }
      wq.protocolWaterQuality.samples.push({
        locationOfWaterSample: {
          latitude: wq.protocolWaterQuality.latitude,
          longitude: wq.protocolWaterQuality.longitude
        },
        waterTemperature: {
          results: []
        },
        dissolvedOxygen: {
          results: []
        },
        salinity: {
          results: []
        },
        pH: {
          results: []
        },
        turbidity: {
          results: []
        },
        ammonia: {
          results: []
        },
        nitrates: {
          results: []
        },
        others: [{
          results: []
        }]
      });
      wq.saveOnBlur();
    };

    wq.removeSampleForm = function (index) {
      wq.protocolWaterQuality.samples.splice(index, 1);
      wq.saveOnBlur();
    };

    var readFromScope = function() {
      wq.protocolWaterQuality = new ProtocolWaterQualityService($scope.protocolWaterQuality);
      if (!wq.protocolWaterQuality.samples || wq.protocolWaterQuality.samples.length === 0) {
        wq.protocolWaterQuality.samples = [];
        wq.addSampleForm();
      }
      wq.protocolWaterQuality.collectionTime = moment(wq.protocolWaterQuality.collectionTime).startOf('minute').toDate();
      $scope.protocolWaterQuality = wq.protocolWaterQuality;
    };

    $scope.$on('readWaterQualityFromScope', function() {
      readFromScope();
    });

    // Set up Protocol Water Quality
    wq.protocolWaterQuality = {};
    if ($stateParams.protocolWaterQualityId) {
      ProtocolWaterQualityService.get({
        waterQualityId: $stateParams.protocolWaterQualityId
      }, function (data) {
        wq.protocolWaterQuality = data;
        wq.protocolWaterQuality.collectionTime = moment(wq.protocolWaterQuality.collectionTime).startOf('minute').toDate();
        $scope.protocolWaterQuality = wq.protocolWaterQuality;
      });
    } else if ($scope.protocolWaterQuality) {
      readFromScope();
    } else {
      wq.protocolWaterQuality = new ProtocolWaterQualityService();
      wq.protocolWaterQuality.samples = [];
      wq.addSampleForm();
      $scope.protocolWaterQuality = wq.protocolWaterQuality;
    }

    wq.authentication = Authentication;
    wq.error = null;
    wq.form = {};

    wq.teamMemberSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'displayName',
      textLookup: function(id) {
        return TeamMembersService.get({ memberId: id }).$promise;
      },
      options: function(searchText) {
        return TeamMembersService.query();
      }
    };

    wq.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    $timeout(function() {
      if (wq && wq.protocolWaterQuality && wq.protocolWaterQuality._id) {
        readFromScope();
        $rootScope.$broadcast('startIncrementalSavingLoop');
      }
    }, 2000);

    wq.openMap = function() {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
    };

    wq.closeMap = function() {
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };
  }
})();
