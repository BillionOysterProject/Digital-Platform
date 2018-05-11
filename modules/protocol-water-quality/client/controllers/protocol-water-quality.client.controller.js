(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityController', ProtocolWaterQualityController);

  ProtocolWaterQualityController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment', '$timeout',
    'lodash', 'ProtocolWaterQualityService', 'ExpeditionViewHelper'];

  function ProtocolWaterQualityController($scope, $rootScope, $state, $stateParams, $http, moment, $timeout,
    lodash, ProtocolWaterQualityService, ExpeditionViewHelper) {

    // Set up the values for dropdowns
    $scope.waterTemperatureMethods = ExpeditionViewHelper.getAllWaterTemperatureMethods();
    $scope.dissolvedOxygenMethods = ExpeditionViewHelper.getAllDissolvedOxygenMethods();
    $scope.salinityMethods = ExpeditionViewHelper.getAllSalinityMethods();
    $scope.pHMethods = ExpeditionViewHelper.getAllPHMethods();
    $scope.turbidityMethods = ExpeditionViewHelper.getAllTurbidityMethods();
    $scope.ammoniaMethods = ExpeditionViewHelper.getAllAmmoniaMethods();
    $scope.nitratesMethods = ExpeditionViewHelper.getAllNitratesMethods();

    $scope.getWaterTemperatureMethod = ExpeditionViewHelper.getWaterTemperatureMethod;
    $scope.getDissolvedOxygenMethod = ExpeditionViewHelper.getDissolvedOxygenMethod;
    $scope.getSalinityMethod = ExpeditionViewHelper.getSalinityMethod;
    $scope.getPHMethod = ExpeditionViewHelper.getPHMethod;
    $scope.getTurbidityMethod = ExpeditionViewHelper.getTurbidityMethod;
    $scope.getAmmoniaMethod = ExpeditionViewHelper.getAmmoniaMethod;
    $scope.getNitratesMethod = ExpeditionViewHelper.getNitratesMethod;

    $scope.waterTemperatureUnits = ExpeditionViewHelper.getAllWaterTemperatureUnits();
    $scope.dissolvedOxygenUnits = ExpeditionViewHelper.getAllDissolvedOxygenUnits();
    $scope.salinityUnits = ExpeditionViewHelper.getAllSalinityUnits();
    $scope.pHUnits = ExpeditionViewHelper.getAllPHUnits();
    $scope.turbidityUnits = ExpeditionViewHelper.getAllTurbidityUnits();
    $scope.ammoniaUnits = ExpeditionViewHelper.getAllAmmoniaUnits();
    $scope.nitratesUnits = ExpeditionViewHelper.getAllNitratesUnits();

    $scope.getDissolvedOxygenUnit = ExpeditionViewHelper.getDissolvedOxygenUnit;
    $scope.getSalinityUnit = ExpeditionViewHelper.getSalinityUnit;
    $scope.getPHUnits = ExpeditionViewHelper.getPHUnits;
    $scope.getTurbidityUnit = ExpeditionViewHelper.getTurbidityUnit;
    $scope.getAmmoniaUnit = ExpeditionViewHelper.getAmmoniaUnit;
    $scope.getNitratesUnit = ExpeditionViewHelper.getNitratesUnit;

    // Get the average of the results
    var average = function(result0, result1, result2) {
      var sum = 0;
      var divBy = 0;
      if (result0) {
        sum += result0;
        divBy += 1;
      }
      if (result1) {
        sum += result1;
        divBy += 1;
      }
      if (result2) {
        sum += result2;
        divBy += 1;
      }

      if (sum && divBy > 0) {
        var avg = (sum / divBy);
        var rounded = avg.toFixed(2);
        return Number(rounded);
      } else {
        return 0;
      }
    };

    // Get water temperature average
    $scope.waterTemperatureAverage = function(sample) {
      sample.waterTemperature.average = average(sample.waterTemperature.results[0], sample.waterTemperature.results[1],
        sample.waterTemperature.results[2]);
    };

    // Get dissoved oxygen average
    $scope.dissolvedOxygenAverage = function(sample) {
      sample.dissolvedOxygen.average = average(sample.dissolvedOxygen.results[0], sample.dissolvedOxygen.results[1],
        sample.dissolvedOxygen.results[2]);
    };

    // Get salinity average
    $scope.salinityAverage = function(sample) {
      sample.salinity.average = average(sample.salinity.results[0], sample.salinity.results[1],
        sample.salinity.results[2]);
    };

    // Get pH average
    $scope.pHAverage = function(sample) {
      sample.pH.average = average(sample.pH.results[0], sample.pH.results[1], sample.pH.results[2]);
    };

    // Get turbidity average
    $scope.turbidityAverage = function(sample) {
      sample.turbidity.average = average(sample.turbidity.results[0], sample.turbidity.results[1],
        sample.turbidity.results[2]);
    };

    // Get ammonia average
    $scope.ammoniaAverage = function(sample) {
      sample.ammonia.average = average(sample.ammonia.results[0], sample.ammonia.results[1],
        sample.ammonia.results[2]);
    };

    // Get nitrates average
    $scope.nitratesAverage = function(sample) {
      sample.nitrates.average = average(sample.nitrates.results[0], sample.nitrates.results[1],
        sample.nitrates.results[2]);
    };

    // Get other average
    $scope.otherAverage = function(other) {
      other.average = average(other.results[0], other.results[1], other.results[2]);
    };

    // Update averages
    var updateAverages = function() {
      for (var i = 0; i < $scope.waterQuality.samples.length; i++) {
        var sample = $scope.waterQuality.samples[i];
        $scope.waterTemperatureAverage(sample);
        $scope.dissolvedOxygenAverage(sample);
        $scope.salinityAverage(sample);
        $scope.pHAverage(sample);
        $scope.turbidityAverage(sample);
        $scope.ammoniaAverage(sample);
        $scope.nitratesAverage(sample);

        for (var j = 0; j < sample.others.length; j++) {
          var other = sample.others[j];
          $scope.otherAverage(other);
        }
      }
    };

    // Add a sample form
    $scope.addSampleForm = function () {
      if ($scope.form && $scope.form.waterQualityForm) {
        $scope.form.waterQualityForm.$setSubmitted(false);
        $scope.form.waterQualityForm.$setPristine(true);
      }
      $scope.waterQuality.samples.push({
        locationOfWaterSample: {
          latitude: $scope.waterQuality.latitude,
          longitude: $scope.waterQuality.longitude
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
    };

    $scope.removeSampleForm = function (index) {
      $scope.waterQuality.samples.splice(index, 1);
    };

    if ($scope.waterQuality) {
      // Set up initial values
      if (!$scope.waterQuality.samples || $scope.waterQuality.samples.length === 0) {
        $scope.waterQuality.samples = [];
        $scope.addSampleForm();
      }
      $scope.waterQuality.collectionTime = moment($scope.waterQuality.collectionTime).startOf('minute').toDate();
    }

    $scope.saveWaterQuality = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.waterQualityForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.waterQualityForm');
      }

      $http.put('/api/protocol-water-quality/' + $scope.waterQuality._id,
        $scope.waterQuality)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            $scope.form.waterQualityForm.$setSubmitted(true);
            errorCallback(data.errors);
          } else {
            $scope.waterQualityErrors = null;
            successCallback();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.form.waterQualityForm.$setSubmitted(true);

          if (data) {
            errorCallback(data.message);
          }
        });

      function successCallback() {
        var waterQualityId = $scope.waterQuality._id;

        saveSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.waterQualityErrors = errorMessage;
        saveErrorCallback();
      }
    };

    $scope.validateWaterQuality = function(validateSuccessCallback, validateErrorCallback) {
      if ($scope.waterQuality && $scope.waterQuality._id) {
        $http.post('/api/protocol-water-quality/' + $scope.waterQuality._id + '/validate',
          $scope.waterQuality)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.waterQualityForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              successCallback();
            }
          })
          .error(function (data, status, headers, config) {
            $scope.form.waterQualityForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        var waterQualityId = $scope.waterQuality._id;
        validateSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.waterQualityErrors = errorMessage;
        validateErrorCallback();
      }
    };
  }
})();
