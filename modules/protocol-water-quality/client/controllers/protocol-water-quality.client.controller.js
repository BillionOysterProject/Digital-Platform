(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityController', ProtocolWaterQualityController);

  ProtocolWaterQualityController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'ProtocolWaterQualityService'];

  function ProtocolWaterQualityController($scope, $state, Authentication, $stateParams, ProtocolWaterQualityService) {
    var wq = this;

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