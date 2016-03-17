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

      om.protocolOysterMeasurement.measuringOysterGrowth = {
        substrateShells: []
      };
      for (var i = 1; i <= om.substrateCount; i++) {
        var measurements = [];
        for (var j = 0; j < om.liveShellCount; j++) {
          measurements.push({
            sizeOfLiveOysterMM: null
          });
        }
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.push({
          substrateShellNumber: i,
          totalNumberOfLiveOystersOnShell: 0,
          measurements: measurements
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
    om.outerSubstrateUploader = om.outerUploaders[0];
    om.innerSubstrateUploader = om.innerUploaders[0];

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
        if (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].totalNumberOfLiveOystersOnShell === 0) {
          substratesValid = false;
        }
      }
      if (substratesValid) {
        $scope.$broadcast('show-errors-check-validity', 'om.form.protocolOysterMeasurementForm');
        return false;
      }

      om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto = {
        path: om.cageConditionPhotoURL
      };

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

        function uploadOuterSubstratePhoto(oysterMeasurementId, substrateIndex, uploader, 
          outerPhotoSuccessCallback, outerPhotoErrorCallback) {
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              outerPhotoSuccessCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
              outerPhotoErrorCallback(response.message);
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/' + index + '/upload-outer-substrate';
            };
            uploader.uploadAll();
          } else {
            outerPhotoSuccessCallback();
          }
        }

        function uploadAllOuterSubstratePhotos(oysterMeasurementId, outerPhotosSuccessCallback, outerPhotosErrorCallback) {
          for (var i = 0; i < om.outerUploaders.length; i++) {
            uploadOuterSubstratePhoto(oysterMeasurementId, i, om.outerUploaders[i], 
              outerPhotosSuccessCallback, outerPhotosErrorCallback);
          }
        }

        function uploadInnerSubstratePhoto(oysterMeasurementId, substrateIndex, uploader, 
          innerPhotoSuccessCallback, innerPhotoErrorCallback) {
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              innerPhotoSuccessCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
              innerPhotoErrorCallback(response.message);
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/' + index + '/upload-inner-substrate';
            };
            uploader.uploadAll();
          } else {
            innerPhotoSuccessCallback();
          }
        }

        function uploadAllInnerSubstratePhotos(oysterMeasurementId, innerPhotosSuccessCallback, innerPhotosErrorCallback) {
          for (var i = 0; i < om.innerUploaders.length; i++) {
            uploadInnerSubstratePhoto(oysterMeasurementId, i, om.innerUploaders[i], 
              innerPhotosSuccessCallback, innerPhotosErrorCallback);
          }
        }

        uploadCageConditionPhoto(oysterMeasurementId, function() {
          uploadAllOuterSubstratePhotos(oysterMeasurementId, function() {
            uploadAllInnerSubstratePhotos(oysterMeasurementId, function() {
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
      var content = angular.element('#modal-substrateshell');
      om.substrate = angular.copy(om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index]);
      om.outerSubstrateUploader = om.outerUploaders[index];
      om.innerSubstrateUploader = om.innerUploaders[index];
      om.outerSubstrateURL = (om.substrate.outerSidePhoto) ? om.substrate.outerSidePhoto.path : '';
      om.innerSubstrateURL = (om.substrate.innerSidePhoto) ? om.substrate.innerSidePhoto.path : '';

      content.modal('show');
    };

    om.saveSubstrateForm = function(substrate, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
        return false;
      } else {
        angular.element('#modal-substrateshell').modal('hide');
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

    om.cancelSubstrateForm = function() {
      angular.element('#modal-substrateshell').modal('hide');
      om.substrate = {};
    };
  }
})();