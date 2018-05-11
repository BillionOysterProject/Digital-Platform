(function () {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
    'lodash', 'ProtocolSiteConditionsService', 'WeatherConditionsService', 'WaterColorsService',
    'WaterFlowService', 'ShorelineTypesService', 'ExpeditionViewHelper'];

  function ProtocolSiteConditionsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, ProtocolSiteConditionsService, WeatherConditionsService, WaterColorsService,
    WaterFlowService, ShorelineTypesService, ExpeditionViewHelper) {

    if ($scope.siteCondition) {
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
    }

    $scope.weatherConditions = ExpeditionViewHelper.getAllWeatherConditions();
    $scope.waterColors = ExpeditionViewHelper.getAllWaterColors();
    $scope.waterFlows = ExpeditionViewHelper.getAllWaterFlows();
    $scope.shorelineTypes = ExpeditionViewHelper.getAllShorelineTypes();
    $scope.garbageExtent = ExpeditionViewHelper.getAllGarbageExtent();
    $scope.windDirection = ExpeditionViewHelper.getAllWindDirections();
    $scope.trueFalse = ExpeditionViewHelper.getAllTrueFalse();

    $scope.getWeatherCondition = ExpeditionViewHelper.getWeatherCondition;
    $scope.getWaterColors = ExpeditionViewHelper.getWaterColors;
    $scope.getWaterFlows = ExpeditionViewHelper.getWaterFlows;
    $scope.getShorelineTypes = ExpeditionViewHelper.getShorelineTypes;
    $scope.getWindDirection = ExpeditionViewHelper.getWindDirection;
    $scope.getGarbageExtent = ExpeditionViewHelper.getGarbageExtent;

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

    $scope.waterGarbageTypes = [{
      name: 'Hard Plastic',
      id: 'hardPlastic',
    }, {
      name: 'Soft Plastic',
      id: 'softPlastic',
    }, {
      name: 'Metal',
      id: 'metal',
    }, {
      name: 'Paper',
      id: 'paper',
    }, {
      name: 'Glass',
      id: 'glass',
    }, {
      name: 'Organic',
      id: 'organic',
    }];

    $scope.landGarbageTypes = [{
      name: 'Hard Plastic',
      id: 'hardPlastic',
    }, {
      name: 'Soft Plastic',
      id: 'softPlastic',
    }, {
      name: 'Metal',
      id: 'metal',
    }, {
      name: 'Paper',
      id: 'paper',
    }, {
      name: 'Glass',
      id: 'glass',
    }, {
      name: 'Organic',
      id: 'organic',
    }];

    $scope.saveSiteCondition = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.siteConditionForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.siteConditionForm');
      }

      // Use incremental-save
      var siteConditionId = $scope.siteCondition._id;
      $scope.siteConditionErrors = null;

      saveImages(function() {
        save();
      });

      function saveImages(callback) {
        function uploadWaterConditionPhoto(siteConditionId, waterPhotoSuccessCallback, waterPhotoErrorCallback) {
          if ($scope.waterConditionUploader.queue.length > 0) {
            $scope.waterConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.waterConditionUploader.removeFromQueue(fileItem);

              var updatedProtocol = ProtocolSiteConditionsService.get({
                siteConditionId: $scope.siteCondition._id
              }, function(data) {
                if (data.waterConditions && data.waterConditions.waterConditionPhoto) {
                  $scope.siteCondition.waterConditions.waterConditionPhoto = data.waterConditions.waterConditionPhoto;
                  $scope.waterConditionPhotoURL = ($scope.siteCondition.waterConditions.waterConditionPhoto &&
                    $scope.siteCondition.waterConditions.waterConditionPhoto.path) ?
                    $scope.siteCondition.waterConditions.waterConditionPhoto.path : '';
                }

                waterPhotoSuccessCallback();
              });
            };

            $scope.waterConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              waterPhotoErrorCallback(response.message);
            };

            $scope.waterConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-water-condition';
              $scope.savingStatus = 'Saving Site Condition: Uploading water condition photo';
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

              var updatedProtocol = ProtocolSiteConditionsService.get({
                siteConditionId: $scope.siteCondition._id
              }, function(data) {
                if (data.landConditions && data.landConditions.landConditionPhoto) {
                  $scope.siteCondition.landConditions.landConditionPhoto = data.landConditions.landConditionPhoto;
                  $scope.landConditionPhotoURL = ($scope.siteCondition.landConditions.landConditionPhoto &&
                    $scope.siteCondition.landConditions.landConditionPhoto.path) ?
                    $scope.siteCondition.landConditions.landConditionPhoto.path : '';
                }

                landPhotoSuccessCallback();
              });
            };

            $scope.landConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              landPhotoErrorCallback(response.message);
            };

            $scope.landConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-site-conditions/' + siteConditionId + '/upload-land-condition';
              $scope.savingStatus = 'Saving Site Condition: Uploading land condition photo';
            };
            $scope.landConditionUploader.uploadAll();
          } else {
            landPhotoSuccessCallback();
          }
        }

        function uploadWaterConditionPhotoCallback(siteConditionId, uploadCallback) {
          uploadWaterConditionPhoto(siteConditionId, function() {
            $scope.finishedSaving += 7;
            uploadCallback();
          }, function(errorMessage) {
            $scope.siteConditionErrors = errorMessage;
            $scope.finishedSaving += 7;
            uploadCallback();
          });
        }

        function uploadLandConditionPhotoCallback(siteConditionId, uploadCallback) {
          uploadLandConditionPhoto(siteConditionId, function() {
            $scope.finishedSaving += 7;
            uploadCallback();
          }, function(errorMessage) {
            $scope.siteConditionErrors = errorMessage;
            $scope.finishedSaving += 7;
            uploadCallback();
          });
        }

        uploadWaterConditionPhotoCallback(siteConditionId, function() {
          uploadLandConditionPhotoCallback(siteConditionId, function() {
            callback();
          });
        });
      }

      function save() {
        $scope.savingStatus = 'Saving Site Condition';
        $http.put('/api/protocol-site-conditions/' + siteConditionId,
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

          if (data) {
            errorCallback(data.message);
          }
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

          if (data) {
            errorCallback(data.message);
          }
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
