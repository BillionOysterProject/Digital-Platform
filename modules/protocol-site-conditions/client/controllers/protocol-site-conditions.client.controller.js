(function () {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
  'lodash', 'ProtocolSiteConditionsService', 'WeatherConditionsService', 'WaterColorsService',
  'WaterFlowService', 'ShorelineTypesService', 'ProtocolSiteConditionsService'];

  function ProtocolSiteConditionsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, ProtocolSiteConditionsService, WeatherConditionsService, WaterColorsService,
    WaterFlowService, ShorelineTypesService) {

    // Set up initial values
    $scope.siteCondition.collectionTime = moment($scope.siteCondition.collectionTime).startOf('minute').toDate();
    $scope.waterConditionPhotoURL = ($scope.siteCondition && $scope.siteCondition.waterConditions &&
      $scope.siteCondition.waterConditions.waterConditionPhoto) ?
      $scope.siteCondition.waterConditions.waterConditionPhoto.path : '';
    $scope.landConditionPhotoURL = ($scope.siteCondition && $scope.siteCondition.landConditions &&
      $scope.siteCondition.landConditions.landConditionPhoto) ?
      $scope.siteCondition.landConditions.landConditionPhoto.path : '';
    if ($scope.siteCondition.tideConditions === undefined) {
      $scope.siteCondition.tideConditions = {
        closestHighTide: moment().startOf('minute').toDate(),
        closestLowTide: moment().startOf('minute').toDate()
      };
    } else {
      $scope.siteCondition.tideConditions.closestHighTide = ($scope.siteCondition.tideConditions.closestHighTide) ?
        moment($scope.siteCondition.tideConditions.closestHighTide).toDate() : moment().startOf('minute').toDate();
      $scope.siteCondition.tideConditions.closestLowTide = ($scope.siteCondition.tideConditions.closestLowTide) ?
        moment($scope.siteCondition.tideConditions.closestLowTide).toDate() : moment().startOf('minute').toDate();
    }
    if (!$scope.siteCondition.landConditions) {
      $scope.siteCondition.landConditions = {
        shorelineSurfaceCoverEstPer: {
          imperviousSurfacePer: 0,
          perviousSurfacePer: 0,
          vegetatedSurfacePer: 0
        }
      };
    }

    // Get the values for the dropdowns
    $scope.weatherConditions = WeatherConditionsService.query();
    $scope.waterColors = WaterColorsService.query();
    $scope.waterFlows = WaterFlowService.query();
    $scope.shorelineTypes = ShorelineTypesService.query();

    $scope.garbageExtent = [
      { label: 'None', value: 'none' },
      { label: 'Sporadic', value: 'sporadic' },
      { label: 'Common', value: 'common' },
      { label: 'Extensive', value: 'extensive' }
    ];

    $scope.trueFalse = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    $scope.openMap = function() {
      if ($scope.siteCondition.waterConditions &&
      $scope.siteCondition.waterConditions.markedCombinedSewerOverflowPipes &&
      $scope.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent === true &&
      $scope.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location === undefined) {
        $scope.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location = {
          latitude: $scope.siteCondition.latitude,
          longitude: $scope.siteCondition.longitude
        };
      }

      if ($scope.siteCondition.waterConditions &&
      $scope.siteCondition.waterConditions.unmarkedOutfallPipes &&
      $scope.siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent === true &&
      $scope.siteCondition.waterConditions.unmarkedOutfallPipes.location === undefined) {
        $scope.siteCondition.waterConditions.unmarkedOutfallPipes.location = {
          latitude: $scope.siteCondition.latitude,
          longitude: $scope.siteCondition.longitude
        };
      }
    };

    $scope.saveSiteCondition = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.siteConditionForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.siteConditionForm');
      }

      if ($scope.waterConditionPhotoURL !== '' && $scope.siteCondition) {
        if ($scope.siteCondition && $scope.siteCondition.waterConditions &&
          $scope.siteCondition.waterConditions.waterConditionPhoto &&
          $scope.siteCondition.waterConditions.waterConditionPhoto.path) {
          $scope.siteCondition.waterConditions.waterConditionPhoto.path = $scope.waterConditionPhotoURL;
        } else if (!$scope.siteCondition.waterConditions) {
          $scope.siteCondition.waterConditions = {
            waterConditionPhoto: {
              path: $scope.waterConditionPhotoURL
            }
          };
        } else {
          $scope.siteCondition.waterConditions.waterConditionPhoto = {
            path: $scope.waterConditionPhotoURL
          };
        }
      }
      if ($scope.landConditionPhotoURL !== '' && $scope.siteCondition) {
        if ($scope.siteCondition && $scope.siteCondition.landConditions &&
          $scope.siteCondition.landConditions.landConditionPhoto &&
          $scope.siteCondition.landConditions.landConditionPhoto.path) {
          $scope.siteCondition.landConditions.landConditionPhoto.path = $scope.landConditionPhotoURL;
        } else if (!$scope.siteCondition.landConditions) {
          $scope.siteCondition.landConditions = {
            landConditionPhoto: {
              path: $scope.landConditionPhotoURL
            }
          };
        } else {
          $scope.siteCondition.landConditions.landConditionPhoto = {
            path: $scope.landConditionPhotoURL
          };
        }
      }

      // Use incremental-save
      var siteConditionId = $scope.siteCondition._id;

      saveImages(function() {
        save();
      });

      function saveImages(callback) {
        function uploadWaterConditionPhoto(siteConditionId, waterPhotoSuccessCallback, waterPhotoErrorCallback) {
          if ($scope.waterConditionUploader.queue.length > 0) {
            $scope.waterConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.waterConditionUploader.removeFromQueue(fileItem);
              waterPhotoSuccessCallback();
            };

            $scope.waterConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              waterPhotoErrorCallback(response.message);
            };

            $scope.waterConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-water-condition';
            };
            $scope.waterConditionUploader.uploadAll();
          } else {
            waterPhotoSuccessCallback();
          }
        }

        function uploadLandConditionPhoto(siteConditionId, landPhotoSuccessCallback, landPhotoErrorCallback) {
          if ($scope.landConditionUploader.queue.length > 0) {
            $scope.landConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.landConditionUploader.removeFromQueue(fileItem);
              landPhotoSuccessCallback();
            };

            $scope.landConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              landPhotoErrorCallback(response.message);
            };

            $scope.landConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-land-condition';
            };
            $scope.landConditionUploader.uploadAll();
          } else {
            landPhotoSuccessCallback();
          }
        }

        uploadWaterConditionPhoto(siteConditionId, function() {
          uploadLandConditionPhoto(siteConditionId, function() {
            var updatedProtocol = ProtocolSiteConditionsService.get({
              siteConditionId: $scope.siteCondition._id
            }, function(data) {
              if (data.waterConditions && data.waterConditions.waterConditionPhoto) {
                $scope.siteCondition.waterConditions.waterConditionPhoto = data.waterConditions.waterConditionPhoto;
                $scope.waterConditionPhotoURL = ($scope.siteCondition.waterConditions.waterConditionPhoto &&
                  $scope.siteCondition.waterConditions.waterConditionPhoto.path) ?
                  $scope.siteCondition.waterConditions.waterConditionPhoto.path : '';
              }

              if (data.landConditions && data.landConditions.landConditionPhoto) {
                $scope.siteCondition.landConditions.landConditionPhoto = data.landConditions.landConditionPhoto;
                $scope.landConditionPhotoURL = ($scope.siteCondition.landConditions.landConditionPhoto &&
                  $scope.siteCondition.landConditions.landConditionPhoto.path) ?
                  $scope.siteCondition.landConditions.landConditionPhoto.path : '';
              }

              callback();
            });
          }, function(errorMessage) {
            $scope.siteConditionErrors = errorMessage;
            callback();
          });
        }, function(errorMessage) {
          $scope.siteConditionErrors = errorMessage;
          callback();
        });
      }

      function save() {
        $http.post('/api/protocol-site-conditions/' + siteConditionId + '/incremental-save',
        $scope.siteCondition)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            $scope.form.siteConditionForm.$setSubmitted(true);
            errorCallback(data.errors);
          } else {
            $scope.siteConditionErrors = null;
            successCallback();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.form.siteConditionForm.$setSubmitted(true);
          errorCallback(data.message);
        });
      }

      function successCallback() {
        $scope.siteConditionErrors = null;
        saveSuccessCallback();
      }

      function errorCallback(errorMessage) {
        if ($scope.siteConditionErrors && $scope.siteConditionErrors !== '') {
          $scope.siteConditionErrors += '\n' + errorMessage;
        } else {
          $scope.siteConditionErrors = errorMessage;
        }
        saveErrorCallback();
      }
    };

    $scope.validateSiteCondition = function(validateSuccessCallback, validateErrorCallback) {
      if ($scope.siteCondition && $scope.siteCondition._id) {
        $http.post('/api/protocol-site-conditions/' + $scope.siteCondition._id + '/validate',
        $scope.siteCondition)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            $scope.form.siteConditionForm.$setSubmitted(true);
            errorCallback(data.errors);
          } else {
            successCallback();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.form.siteConditionForm.$setSubmitted(true);
          errorCallback(data.message);
        });
      }

      function successCallback() {
        $scope.siteConditionErrors = null;
        validateSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.siteConditionErrors = errorMessage;
        validateErrorCallback();
      }
    };
  }
})();
