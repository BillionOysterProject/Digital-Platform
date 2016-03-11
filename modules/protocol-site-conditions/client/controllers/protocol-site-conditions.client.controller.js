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
    vm.protocolSiteCondition = {};
    if ($stateParams.protocolSiteConditionId) {
      ProtocolSiteConditionsService.get({
        siteConditionId: $stateParams.protocolSiteConditionId
      }, function(data) {
        vm.protocolSiteCondition = data;  
        vm.waterConditionPhotoURL = vm.protocolSiteCondition.waterConditions.waterConditionPhoto.path;
        vm.landConditionPhotoURL = vm.protocolSiteCondition.landConditions.landConditionPhoto.path;
      }); 
    } else {
      vm.protocolSiteCondition = new ProtocolSiteConditionsService();
      vm.protocolSiteCondition.landConditions = {
        shorelineSurfaceCoverEstPer: {
          imperviousSurfacePer: 0,
          perviousSurfacePer: 0,
          vegetatedSurfacePer: 0
        }
      };
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

    vm.waterConditionUploader = new FileUploader({
      alias: 'newWaterConditionPicture',
    });

    vm.landConditionUploader = new FileUploader({
      alias: 'newLandConditionPicture',
    });

    // Remove existing protocol site condition
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.protocolSiteCondition.$remove($state.go('protocol-site-conditions.main'));
      }
    };

    // Save protocol site condition
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.protocolSiteConditionForm');
        return false;
      }

      vm.protocolSiteCondition.waterConditions.waterConditionPhoto = {
        path: vm.waterConditionPhotoURL
      };
      vm.protocolSiteCondition.landConditions.landConditionPhoto = {
        path: vm.landConditionPhotoURL
      };

      // TODO: move create/update logic to service
      if (vm.protocolSiteCondition._id) {
        vm.protocolSiteCondition.$update(successCallback, errorCallback);
      } else {
        vm.protocolSiteCondition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var siteConditionId = res._id;

        function goToView(siteConditionId) {
          $state.go('protocol-site-conditions.view', {
            protocolSiteConditionId: siteConditionId
          });
        }

        function uploadWaterConditionPhoto(siteConditionId, waterPhotoSuccessCallback, waterPhotoErrorCallback) {
          if (vm.waterConditionUploader.queue.length > 0) {
            vm.waterConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              waterPhotoSuccessCallback();
            };

            vm.waterConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              waterPhotoErrorCallback(response.message);
            };
            
            vm.waterConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-water-condition';
            };
            vm.waterConditionUploader.uploadAll();
          } else {
            waterPhotoSuccessCallback();
          }
        }

        function uploadLandConditionPhoto(siteConditionId, landPhotoSuccessCallback, landPhotoErrorCallback) {
          if (vm.landConditionUploader.queue.length > 0) {
            vm.landConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              landPhotoSuccessCallback();
            };

            vm.landConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              landPhotoErrorCallback(response.message);
            };
            
            vm.landConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-land-condition';
            };
            vm.landConditionUploader.uploadAll();
          } else {
            landPhotoSuccessCallback();
          }
        }

        uploadWaterConditionPhoto(siteConditionId, function() {
          uploadLandConditionPhoto(siteConditionId, function() {
            goToView(siteConditionId);
          }, function(errorMessage) {
            vm.error = errorMessage;
          });
        }, function(errorMessage) {
          vm.error = errorMessage;
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