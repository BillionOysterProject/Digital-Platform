(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'FileUploader',
    'ProtocolSiteConditionsService', 'WeatherConditionsService', 'WaterColorsService', 'WaterFlowService', 'ShorelineTypesService'];

  function ProtocolSiteConditionsController($scope, $state, Authentication, $stateParams, FileUploader,
    ProtocolSiteConditionsService, WeatherConditionsService, WaterColorsService, WaterFlowService, ShorelineTypesService) {
    var vm = this;

    // Set up Protocol Site Condition
    vm.protocolSiteCondition = ($stateParams.protocolSiteConditionId) ? ProtocolSiteConditionsService.get({
      siteConditionId: $stateParams.protocolSiteConditionId
    }) : new ProtocolSiteConditionsService();
    
    if (!$stateParams.protocolSiteConditionId) {
      vm.protocolSiteCondition.landConditions = {
        shorelineSurfaceCoverEstPer: {
          imperviousSurfacePer: 0,
          perviousSurfacePer: 0,
          vegetatedSurfacePer: 0
        }
      };
    } else {
      //vm.waterConditionPhotoURL = vm.protocolSiteCondition.waterConditions.waterConditionPhoto;
      //vm.landConditionPhotoURL = vm.protocolSiteCondition.landConditions.landConditionPhoto;
    }

    vm.weatherConditions = WeatherConditionsService.query();
    vm.waterColors = WaterColorsService.query();
    vm.waterFlows = WaterFlowService.query();
    vm.shorelineTypes = ShorelineTypesService.query();

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    vm.garbageExtent = [
      { label: 'None', value: 'none' },
      { label: 'Sporadic', value: 'sporadic' },
      { label: 'Common', value: 'common' },
      { label: 'Extensive', value: 'extensive' }
    ];

    vm.trueFalse = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    // Remove existing protocol site condition
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.protocolSiteCondition.$remove($state.go('protocol-site-conditions.main'));
      }
    };

    // Save protocol site condition
    vm.save = function(isValid) {
      console.log('photo');
      console.log(vm.waterConditionPhoto);
      console.log(vm.waterConditionPhotoFilename);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.protocolSiteConditionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.protocolSiteCondition._id) {
        vm.protocolSiteCondition.$update(successCallback, errorCallback);
      } else {
        vm.protocolSiteCondition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('protocol-site-conditions.view', {
          siteConditionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('protocol-site-conditions.main');
    };
  }
})();