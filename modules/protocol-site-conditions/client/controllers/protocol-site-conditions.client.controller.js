(function () {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'FileUploader',
    'ProtocolSiteConditionsService', 'WeatherConditionsService', 'WaterColorsService', 'WaterFlowService', 'ShorelineTypesService'];

  function ProtocolSiteConditionsController($scope, $state, Authentication, $stateParams, FileUploader,
    ProtocolSiteConditionsService, WeatherConditionsService, WaterColorsService, WaterFlowService, ShorelineTypesService) {
    var sc = this;

    // Set up Protocol Site Condition
    sc.protocolSiteCondition = {};
    if ($stateParams.protocolSiteConditionId) {
      ProtocolSiteConditionsService.get({
        siteConditionId: $stateParams.protocolSiteConditionId
      }, function(data) {
        sc.protocolSiteCondition = data;
        sc.waterConditionPhotoURL = (sc.protocolSiteCondition.waterConditions.waterConditionPhoto) ?
          sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path : '';
        sc.landConditionPhotoURL = (sc.protocolSiteCondition.landConditions.landConditionPhoto) ?
          sc.protocolSiteCondition.landConditions.landConditionPhoto.path : '';
      });
    } else if ($scope.protocolSiteCondition) {
      sc.protocolSiteCondition = $scope.protocolSiteCondition;
      sc.waterConditionPhotoURL = (sc.protocolSiteCondition.waterConditions &&
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto) ?
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path : '';
      sc.landConditionPhotoURL = (sc.protocolSiteCondition.landConditions &&
        sc.protocolSiteCondition.landConditions.landConditionPhoto) ?
        sc.protocolSiteCondition.landConditions.landConditionPhoto.path : '';
      if (!sc.protocolSiteCondition.landConditions) {
        sc.protocolSiteCondition.landConditions = {
          shorelineSurfaceCoverEstPer: {
            imperviousSurfacePer: 0,
            perviousSurfacePer: 0,
            vegetatedSurfacePer: 0
          }
        };
      }
    } else {
      sc.protocolSiteCondition = new ProtocolSiteConditionsService();
      sc.protocolSiteCondition.landConditions = {
        shorelineSurfaceCoverEstPer: {
          imperviousSurfacePer: 0,
          perviousSurfacePer: 0,
          vegetatedSurfacePer: 0
        }
      };
      sc.waterConditionPhotoURL = '';
      sc.landConditionPhotoURL = '';
    }

    sc.weatherConditions = WeatherConditionsService.query();
    sc.waterColors = WaterColorsService.query();
    sc.waterFlows = WaterFlowService.query();
    sc.shorelineTypes = ShorelineTypesService.query();

    sc.authentication = Authentication;
    sc.error = null;
    sc.form = {};

    sc.garbageExtent = [
      { label: 'None', value: 'none' },
      { label: 'Sporadic', value: 'sporadic' },
      { label: 'Common', value: 'common' },
      { label: 'Extensive', value: 'extensive' }
    ];

    sc.trueFalse = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    sc.waterConditionUploader = new FileUploader({
      alias: 'newWaterConditionPicture',
    });

    sc.landConditionUploader = new FileUploader({
      alias: 'newLandConditionPicture',
    });

    // Remove existing protocol site condition
    sc.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        sc.protocolSiteCondition.$remove($state.go('protocol-site-conditions.main'));
      }
    };

    // Save protocol site condition
    sc.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'sc.form.protocolSiteConditionForm');
        return false;
      }

      if (!sc.waterConditionPhotoURL || sc.waterConditionPhotoURL === '') {
        sc.error = 'Water Condition photo is required';
        return false;
      } else {
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto = {
          path: sc.waterConditionPhotoURL
        };
      }

      if (!sc.landConditionPhotoURL || sc.landConditionPhotoURL === '') {
        sc.error = 'Land Condition photo is required';
        return false;
      } else {
        sc.protocolSiteCondition.landConditions.landConditionPhoto = {
          path: sc.landConditionPhotoURL
        };
      }

      // TODO: move create/update logic to service
      if (sc.protocolSiteCondition._id) {
        sc.protocolSiteCondition.$update(successCallback, errorCallback);
      } else {
        sc.protocolSiteCondition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var siteConditionId = res._id;

        function goToView(siteConditionId) {
          $state.go('protocol-site-conditions.view', {
            protocolSiteConditionId: siteConditionId
          });
        }

        function uploadWaterConditionPhoto(siteConditionId, waterPhotoSuccessCallback, waterPhotoErrorCallback) {
          if (sc.waterConditionUploader.queue.length > 0) {
            sc.waterConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              waterPhotoSuccessCallback();
            };

            sc.waterConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              waterPhotoErrorCallback(response.message);
            };

            sc.waterConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-water-condition';
            };
            sc.waterConditionUploader.uploadAll();
          } else {
            waterPhotoSuccessCallback();
          }
        }

        function uploadLandConditionPhoto(siteConditionId, landPhotoSuccessCallback, landPhotoErrorCallback) {
          if (sc.landConditionUploader.queue.length > 0) {
            sc.landConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              landPhotoSuccessCallback();
            };

            sc.landConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              landPhotoErrorCallback(response.message);
            };

            sc.landConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-land-condition';
            };
            sc.landConditionUploader.uploadAll();
          } else {
            landPhotoSuccessCallback();
          }
        }

        uploadWaterConditionPhoto(siteConditionId, function() {
          uploadLandConditionPhoto(siteConditionId, function() {
            goToView(siteConditionId);
          }, function(errorMessage) {
            delete sc.protocolSiteCondition._id;
            sc.error = errorMessage;
            return false;
          });
        }, function(errorMessage) {
          delete sc.protocolSiteCondition._id;
          sc.error = errorMessage;
          return false;
        });

      }

      function errorCallback(res) {
        sc.error = res.data.message;
      }
    };

    sc.cancel = function() {
      $state.go('protocol-site-conditions.main');
    };
  }
})();
