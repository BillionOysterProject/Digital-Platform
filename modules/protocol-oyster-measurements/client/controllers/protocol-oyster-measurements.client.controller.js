(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsController', ProtocolOysterMeasurementsController);

  ProtocolOysterMeasurementsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'FileUploader',
    'ProtocolOysterMeasurementsService', 'BioaccumulationService'];

  function ProtocolOysterMeasurementsController($scope, $state, Authentication, $stateParams, FileUploader, 
    ProtocolOysterMeasurementsService, BioaccumulationService) {
    var om = this;

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
      for (var i = 1; i <= 10; i++) {
        var measurements = [];
        for (var j = 0; j < 45; j++) {
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

        uploadCageConditionPhoto(oysterMeasurementId, function() {
          goToView(oysterMeasurementId);
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
      om.substrate = angular.copy(om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index]);
      angular.element('#modal-substrateshell').modal('show');
    };

    om.saveSubstrateForm = function(substrate, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'om.form.protocolOysterMeasurementForm');
        return false;
      } else {
        angular.element('#modal-substrateshell').modal('hide');
        substrate = om.findSubstrateStats(substrate);
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