(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityController', ProtocolWaterQualityController);

  ProtocolWaterQualityController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment',
  'Authentication', 'ProtocolWaterQualityService', 'TeamMembersService'];

  function ProtocolWaterQualityController($scope, $rootScope, $state, $stateParams, $http, moment,
    Authentication, ProtocolWaterQualityService, TeamMembersService) {
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

    $scope.$on('incrementalSaveWaterQuality', function() {
      wq.saveOnBlur();
    });

    wq.saveOnBlur = function() {
      if (wq.protocolWaterQuality._id) {
        $rootScope.$broadcast('savingStart');
        $http.post('/api/protocol-water-quality/' + wq.protocolWaterQuality._id + '/incremental-save',
        wq.protocolWaterQuality)
        .success(function (data, status, headers, config) {
          wq.protocolWaterQuality = data;
          wq.protocolWaterQuality.collectionTime = moment(wq.protocolWaterQuality.collectionTime).toDate();
          console.log('saved');
        })
        .error(function (data, status, headers, config) {
          wq.error = data.message;
        });
      }
    };

    wq.addSampleForm = function () {
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

    // Set up Protocol Water Quality
    wq.protocolWaterQuality = {};
    if ($stateParams.protocolWaterQualityId) {
      ProtocolWaterQualityService.get({
        waterQualityId: $stateParams.protocolWaterQualityId
      }, function (data) {
        wq.protocolWaterQuality = data;
        wq.protocolWaterQuality.collectionTime = moment(wq.protocolWaterQuality.collectionTime).toDate();
      });
    } else if ($scope.protocolWaterQuality) {
      wq.protocolWaterQuality = new ProtocolWaterQualityService($scope.protocolWaterQuality);
      if (!wq.protocolWaterQuality.samples || wq.protocolWaterQuality.samples.length === 0) {
        wq.protocolWaterQuality.samples = [];
        wq.addSampleForm();
      }
      wq.protocolWaterQuality.collectionTime = moment(wq.protocolWaterQuality.collectionTime).toDate();
    } else {
      wq.protocolWaterQuality = new ProtocolWaterQualityService();
      wq.protocolWaterQuality.samples = [];
      wq.addSampleForm();
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

    wq.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        wq.protocolWaterQuality.$remove($state.go('protocol-water-quality.main'));
      }
    };

    $scope.$on('saveWaterQuality', function() {
      wq.form.waterQualityForm.$setSubmitted(true);
      wq.save(wq.form.waterQualityForm.$valid);

    });

    wq.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'wq.form.waterQualityForm');
        $rootScope.$broadcast('saveWaterQualityError');
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
        $rootScope.$broadcast('saveWaterQualitySuccessful');
      }

      function errorCallback(res) {
        wq.error = res.data.message;
        $rootScope.$broadcast('saveWaterQualityError');
      }
    };

    wq.cancel = function() {
      $state.go('protocol-water-quality.main');
    };
  }
})();
