(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityController', ProtocolWaterQualityController);

  ProtocolWaterQualityController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'ProtocolWaterQualityService'];

  function ProtocolWaterQualityController($scope, $state, Authentication, $stateParams, ProtocolWaterQualityService) {
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
      { name: 'NTU**', value: 'ntu' }
    ];

    wq.ammoniaUnits = [
      { name: 'PPM', value: 'ppm' }
    ];

    wq.nitratesUnits = [
      { name: 'PPM', value: 'ppm' }
    ];

    wq.addSampleForm = function () {
      wq.protocolWaterQuality.samples.push({
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

    wq.removeSampleForm = function (index) {
      wq.protocolWaterQuality.samples.splice(index, 1);
    };

    // Set up Protocol Water Quality
    wq.protocolWaterQuality = {};
    if ($stateParams.protocolWaterQualityId) {
      ProtocolWaterQualityService.get({
        waterQualityId: $stateParams.protocolWaterQualityId
      }, function (data) {
        wq.protocolWaterQuality = data;
      });
    } else if ($scope.protocolWaterQuality) {
      wq.protocolWaterQuality = $scope.protocolWaterQuality;
      if (!wq.protocolWaterQuality.samples || wq.protocolWaterQuality.samples.length === 0) {
        wq.protocolWaterQuality.samples = [];
        wq.addSampleForm();
      }
    } else {
      wq.protocolWaterQuality = new ProtocolWaterQualityService();
      wq.protocolWaterQuality.samples = [];
      wq.addSampleForm();
    }

    wq.authentication = Authentication;
    wq.error = null;
    wq.form = {};

    wq.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        wq.protocolWaterQuality.$remove($state.go('protocol-water-quality.main'));
      }
    };

    wq.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'wq.form.protocolWaterQualityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (wq.protocolWaterQuality._id) {
        wq.protocolWaterQuality.$update(successCallback, errorCallback);
      } else {
        wq.protocolWaterQuality.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var waterQualityId = res._id;

        $state.go('protocol-water-quality.view', {
          protocolWaterQualityId: waterQualityId
        });
      }

      function errorCallback(res) {
        wq.error = res.data.message;
      }
    };

    wq.cancel = function() {
      $state.go('protocol-water-quality.main');
    };
  }
})();
