(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsController', ProtocolOysterMeasurementsController);

  ProtocolOysterMeasurementsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', '$compile', '$rootScope',
    'FileUploader', 'ProtocolOysterMeasurementsService', 'BioaccumulationService'];

  function ProtocolOysterMeasurementsController($scope, $state, Authentication, $stateParams, $compile, $rootScope,
    FileUploader, ProtocolOysterMeasurementsService, BioaccumulationService) {
    var om = this;

    om.substrateCount = 10;
    om.liveShellCount = 45;

    // Set up Protocol Oyster Measurements
    om.protocolOysterMeasurement = {};
    if ($stateParams.protocolOysterMeasurementId) {
      ProtocolOysterMeasurementsService.get({
        oysterMeasurementId: $stateParams.protocolOysterMeasurementId
      }, function(data) {
        om.protocolOysterMeasurement = data;
        om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
          om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
      });
    } else {
      om.protocolOysterMeasurement = new ProtocolOysterMeasurementsService();
      om.cageConditionPhotoURL = '';

      var measurements = [];
      for (var j = 0; j < om.liveShellCount; j++) {
        measurements.push({
          sizeOfLiveOysterMM: null
        });
      }

      om.protocolOysterMeasurement.measuringOysterGrowth = {
        substrateShells: []
      };
      for (var i = 1; i <= om.substrateCount; i++) {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.push({
          substrateShellNumber: i,
          totalNumberOfLiveOystersOnShell: 0,
          measurements: angular.copy(measurements)
        });
      }
    }

    om.bioaccumulations = BioaccumulationService.query();

    om.authentication = Authentication;
    om.error = null;
    om.form = {};

    om.cageConditionUploader = new FileUploader({
      alias: 'newOysterCageConditionPicture'
    });

    om.outerUploaders = [];
    om.innerUploaders = [];

    for (var k = 0; k < om.substrateCount; k++) {
      om.outerUploaders.push(new FileUploader({ alias: 'newOuterSubstratePicture' }));
      om.innerUploaders.push(new FileUploader({ alias: 'newInnerSubstratePicture' }));
    }

    // Remove existing protocol oyster measurement
    om.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        om.protocolOysterMeasurement.$remove($state.go('protocol-oyster-measurements.main'));
      }
    };

    // Save protocol oyster measurement
    om.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'om.form.protocolOysterMeasurementForm');
        return false;
      }
      var substratesValid = true;
      for (var i = 0; i < om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
        if (!om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].source) {
          substratesValid = false;
        }
      }
      if (!substratesValid) {
        $scope.$broadcast('show-errors-check-validity', 'om.form.protocolOysterMeasurementForm');
        return false;
      }

      om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto = {
        path: om.cageConditionPhotoURL
      };

      // TODO: move create/update logic to service
      if (om.protocolOysterMeasurement._id) {
        om.protocolOysterMeasurement.$update(successCallback, errorCallback);
      } else {
        om.protocolOysterMeasurement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var oysterMeasurementId = res._id;

        function goToView(oysterMeasurementId) {
          $state.go('protocol-oyster-measurements.view', {
            protocolOysterMeasurementId: oysterMeasurementId
          });
        }

        function uploadCageConditionPhoto(oysterMeasurementId, cagePhotoSuccessCallback, cagePhotoErrorCallback) {
          if (om.cageConditionUploader.queue.length > 0) {
            om.cageConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              cagePhotoSuccessCallback();
            };

            om.cageConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              cagePhotoErrorCallback(response.message);
            };

            om.cageConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/upload-oyster-cage-condition';
            };
            om.cageConditionUploader.uploadAll();
          } else {
            cagePhotoSuccessCallback();
          }
        }

        function uploadAllOuterPhotos(oysterMeasurementId, outerPhotosSuccessCallback, outerPhotosErrorCallback) {
          function uploadOuterPhoto(oysterMeasurementId, index, outerPhotoSuccessCallback, outerPhotoErrorCallback) {
            if (index < om.outerUploaders.length && om.outerUploaders[index]) {
              var uploader = om.outerUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadOuterPhoto(oysterMeasurementId, index+1, outerPhotoSuccessCallback, outerPhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.error = response.message;
                  outerPhotoErrorCallback(index);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/index/' + index + '/upload-outer-substrate';
                };
                uploader.uploadAll();
              } else {
                uploadOuterPhoto(oysterMeasurementId, index+1, outerPhotoSuccessCallback, outerPhotoErrorCallback);
              }
            } else {
              outerPhotoSuccessCallback();
            }
          }

          uploadOuterPhoto(oysterMeasurementId, 0, function() {
            outerPhotosSuccessCallback();
          }, function(index) {
            outerPhotosErrorCallback('Error uploading outer side photo for Substrate Shell #' + (index+1));
          });
        }

        function uploadAllInnerPhotos(oysterMeasurementId, innerPhotosSuccessCallback, innerPhotosErrorCallback) {
          function uploadInnerPhoto(oysterMeasurementId, index, innerPhotoSuccessCallback, innerPhotoErrorCallback) {
            if (index < om.innerUploaders.length && om.innerUploaders[index]) {
              var uploader = om.innerUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadInnerPhoto(oysterMeasurementId, index+1, innerPhotoSuccessCallback, innerPhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.error = response.message;
                  innerPhotoErrorCallback(index);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/index/' + index + '/upload-inner-substrate';
                };
                uploader.uploadAll();
              } else {
                uploadInnerPhoto(oysterMeasurementId, index+1, innerPhotoSuccessCallback, innerPhotoErrorCallback);
              }
            } else {
              innerPhotoSuccessCallback();
            }
          }

          uploadInnerPhoto(oysterMeasurementId, 0, function() {
            innerPhotosSuccessCallback();
          }, function(index) {
            innerPhotosErrorCallback('Error uploading inner side photo for Substrate Shell #' + (index+1));
          });
        }

        uploadCageConditionPhoto(oysterMeasurementId, function() {
          uploadAllOuterPhotos(oysterMeasurementId, function() {
            uploadAllInnerPhotos(oysterMeasurementId, function() {
              goToView(oysterMeasurementId);
            }, function(errorMessage) {
              om.error = errorMessage;
            });
          }, function(errorMessage) {
            om.error = errorMessage;
          });
        }, function(errorMessage) {
          om.error = errorMessage;
        });
      }

      function errorCallback(res) {
        om.error = res.data.message;
      }
    };

    om.cancel = function() {
      $state.go('protocol-oyster-measurements.main');
    };

    om.openSubstrateForm = function(index) {
      var content = angular.element('#modal-substrateshell'+index);
      om.outerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto) ? 
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.path : '';
      om.innerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto) ? 
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.path : '';
      content.modal('show');
    };

    om.saveSubstrateForm = function(substrate, index, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
        return false;
      } else {
        angular.element('#modal-substrateshell'+index).modal('hide');
        substrate = om.findSubstrateStats(substrate);
        substrate.outerSidePhoto = {
          path: om.outerSubstrateURL
        };
        substrate.innerSidePhoto = {
          path: om.innerSubstrateURL
        };
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[substrate.substrateShellNumber-1] = substrate;
        om.findOverallStats();
      }
    };

    om.findSubstrateStats = function(substrate) {
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var count = 0;
      var totalSize = 0;

      for (var i = 0; i < substrate.measurements.length; i++) {
        var size = substrate.measurements[i].sizeOfLiveOysterMM;
        if (size !== null) {
          if (size > max) {
            max = size;
          }
          if (size < min) {
            min = size;
          }
          count++;
          totalSize += size;
        }
      }

      substrate.minimumSizeOfLiveOysters = min;
      substrate.maximumSizeOfLiveOysters = max;
      substrate.averageSizeOfLiveOysters = (totalSize/count);

      return substrate;
    };

    om.findOverallStats = function() {
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var count = 0;
      var totalSize = 0;

      for (var i = 0; i < om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
        var substrate = om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i];
        if (substrate.minimumSizeOfLiveOysters && substrate.maximumSizeOfLiveOysters && 
          substrate.totalNumberOfLiveOystersOnShell && substrate.averageSizeOfLiveOysters) {
          
          if (substrate.minimumSizeOfLiveOysters < min) {
            min = substrate.minimumSizeOfLiveOysters;
          }

          if (substrate.maximumSizeOfLiveOysters > max) {
            max = substrate.maximumSizeOfLiveOysters;
          }

          count += substrate.totalNumberOfLiveOystersOnShell;
          totalSize += (substrate.averageSizeOfLiveOysters * substrate.totalNumberOfLiveOystersOnShell);
        }
      }

      om.protocolOysterMeasurement.minimumSizeOfAllLiveOysters = min;
      om.protocolOysterMeasurement.maximumSizeOfAllLiveOysters = max;
      om.protocolOysterMeasurement.averageSizeOfAllLiveOysters = (totalSize/count);
      om.protocolOysterMeasurement.totalNumberOfAllLiveOysters = count;
    };

    om.cancelSubstrateForm = function(index) {
      angular.element('#modal-substrateshell'+index).modal('hide');
      om.substrate = {};
    };
  }
})();