(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsController', ProtocolOysterMeasurementsController);

  ProtocolOysterMeasurementsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
    'Authentication', 'FileUploader', 'ProtocolOysterMeasurementsService', 'BioaccumulationService', 'TeamMembersService'];

  function ProtocolOysterMeasurementsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    Authentication, FileUploader, ProtocolOysterMeasurementsService, BioaccumulationService, TeamMembersService) {
    var om = this;

    om.substrateCount = 10;
    om.liveShellCount = 45;

    om.checkDone = function(substrate) {
      if (substrate.totalNumberOfLiveOystersOnShell > 0 && substrate.outerSidePhoto && substrate.outerSidePhoto.path &&
        substrate.innerSidePhoto && substrate.innerSidePhoto.path && substrate.minimumSizeOfLiveOysters &&
        substrate.maximumSizeOfLiveOysters && substrate.averageSizeOfLiveOysters) {
        return true;
      } else {
        return false;
      }
    };

    var setupSubstrateShells = function() {
      var measurements = [];
      for (var j = 0; j < om.liveShellCount; j++) {
        measurements.push({
          sizeOfLiveOysterMM: null
        });
      }

      if (om.protocolOysterMeasurement.measuringOysterGrowth &&
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells &&
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length > 0) {
        for (var h = 0; h < om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length; h++) {
          om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[h].substrateShellNumber = h+1;
        }
      } else {
        om.protocolOysterMeasurement.measuringOysterGrowth = {
          substrateShells: []
        };
      }

      var totalToAdd = om.substrateCount - om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length;
      for (var i = 1; i <= totalToAdd; i++) {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.push({
          substrateShellNumber: i,
          totalNumberOfLiveOystersOnShell: 0,
          measurements: angular.copy(measurements),
          done: false
        });
      }
    };

    // Set up Protocol Oyster Measurements
    om.protocolOysterMeasurement = {};
    if ($stateParams.protocolOysterMeasurementId) {
      ProtocolOysterMeasurementsService.get({
        oysterMeasurementId: $stateParams.protocolOysterMeasurementId
      }, function(data) {
        om.protocolOysterMeasurement = data;
        om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
          om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
        om.protocolOysterMeasurement.collectionTime = moment(om.protocolOysterMeasurement.collectionTime).startOf('minute').toDate();
      });
    } else if ($scope.protocolOysterMeasurement) {
      om.protocolOysterMeasurement = new ProtocolOysterMeasurementsService($scope.protocolOysterMeasurement);
      om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage &&
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
      om.protocolOysterMeasurement.collectionTime = moment(om.protocolOysterMeasurement.collectionTime).startOf('minute').toDate();
      if (!om.protocolOysterMeasurement.measuringOysterGrowth ||
        !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells ||
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length < om.substrateCount) {
        setupSubstrateShells();
      }
    } else {
      om.protocolOysterMeasurement = new ProtocolOysterMeasurementsService();
      om.cageConditionPhotoURL = '';
      setupSubstrateShells();
    }

    var findPreviousValues = function() {
      $http.get('/api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/previous')
      .success(function (data, status, headers, config) {
        if (om.protocolOysterMeasurement.totalNumberOfAllLiveOysters && data.totalNumberOfAllLiveOysters &&
        om.protocolOysterMeasurement.averageSizeOfAllLiveOysters && data.averageSizeOfAllLiveOysters &&
        om.protocolOysterMeasurement.minimumSizeOfAllLiveOysters && data.minimumSizeOfAllLiveOysters &&
        om.protocolOysterMeasurement.maximumSizeOfAllLiveOysters && data.maximumSizeOfAllLiveOysters) {
          var mortality = (((om.protocolOysterMeasurement.totalNumberOfAllLiveOysters - data.totalNumberOfAllLiveOysters) / data.totalNumberOfAllLiveOysters)*-100).toFixed(2);
          var growth = (((om.protocolOysterMeasurement.averageSizeOfAllLiveOysters - data.averageSizeOfAllLiveOysters) / data.averageSizeOfAllLiveOysters)*100).toFixed(2);
          var min = (((om.protocolOysterMeasurement.minimumSizeOfAllLiveOysters - data.minimumSizeOfAllLiveOysters) / data.minimumSizeOfAllLiveOysters)*100).toFixed(2);
          var max = (((om.protocolOysterMeasurement.maximumSizeOfAllLiveOysters - data.maximumSizeOfAllLiveOysters) / data.maximumSizeOfAllLiveOysters)*100).toFixed(2);
          om.previous = {
            mortality: mortality,
            growth: growth,
            min: min,
            max: max
          };
        }
      })
      .error(function (data, status, headers, config) {
        console.log('Could not find previous');
      });
    };

    if (om.protocolOysterMeasurement._id) {
      findPreviousValues();
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

    om.teamMemberSelectConfig = {
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

    om.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    // Remove existing protocol oyster measurement
    om.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        om.protocolOysterMeasurement.$remove($state.go('protocol-oyster-measurements.main'));
      }
    };

    $scope.$on('saveOysterMeasurement', function() {
      om.form.oysterMeasurementForm.$setSubmitted(true);
      om.save(om.form.oysterMeasurementForm.$valid);
    });

    // Save protocol oyster measurement
    om.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'om.form.oysterMeasurementForm');
        $rootScope.$broadcast('saveOysterMeasurementError');
        return false;
      }

      om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto = {
        path: om.cageConditionPhotoURL
      };

      var imageErrorMessages = [];
      if (!om.cageConditionPhotoURL || om.cageConditionPhotoURL === '') {
        imageErrorMessages.push('Cage Condition photo is required');
        return false;
      }

      om.substratesValid = true;
      for (var i = 0; i < om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
        var substrateShell = om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i];

        var oneSuccessfulSubstrateShell = false;

        var allOystersMeasured = function(substrateShell) {
          var filledOutCount = 0;
          for (var k = 0; k < substrateShell.measurements.length; k++) {
            if (substrateShell.measurements[k].sizeOfLiveOysterMM !== null) {
              filledOutCount++;
            }
          }
          return substrateShell.totalNumberOfLiveOystersOnShell === filledOutCount;
        };

        if (substrateShell.outerSidePhoto && substrateShell.outerSidePhoto.path !== undefined &&
          substrateShell.outerSidePhoto.path !== '' && substrateShell.innerSidePhoto &&
          substrateShell.innerSidePhoto.path !== undefined && substrateShell.innerSidePhoto.path !== '' &&
          substrateShell.totalNumberOfLiveOystersOnShell > 0 && allOystersMeasured(substrateShell)) {
          oneSuccessfulSubstrateShell = true;
        } else if ((!substrateShell.outerSidePhoto || substrateShell.outerSidePhoto.path === undefined ||
          substrateShell.outerSidePhoto.path === '') && (!substrateShell.innerSidePhoto ||
          substrateShell.innerSidePhoto.path === undefined || substrateShell.innerSidePhoto.path === '') &&
          substrateShell.totalNumberOfLiveOystersOnShell === undefined) {

        } else {
          if (!om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].source) {
            om.substratesValid = false;
          }

          if (!om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto ||
          !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto.path ||
          om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto.path === '') {
            imageErrorMessages.push('Outer side photo is required for Substrate Shell #' + (i+1));
            om.substratesValid = false;
          }

          if (!om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto ||
          !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto.path ||
          om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto.path === '') {
            imageErrorMessages.push('Inner side photo is required for Substrate Shell #' + (i+1));
            om.substratesValid = false;
          }
        }
      }
      if (!om.substratesValid) {
        if (imageErrorMessages.length > 0) {
          om.error = imageErrorMessages;
        }
        $scope.$broadcast('show-errors-check-validity', 'om.form.oysterMeasurementForm');
        $rootScope.$broadcast('saveOysterMeasurementError');
        return false;
      }

      // TODO: move create/update logic to service
      if (om.protocolOysterMeasurement._id) {
        om.protocolOysterMeasurement.$update(successCallback, errorCallback);
      } else {
        om.protocolOysterMeasurement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var oysterMeasurementId = res._id;

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
              $rootScope.$broadcast('saveOysterMeasurementSuccessful');
            }, function(errorMessage) {
              delete om.protocolOysterMeasurement._id;
              om.error = errorMessage;
              $rootScope.$broadcast('saveOysterMeasurementError');
              return false;
            });
          }, function(errorMessage) {
            delete om.protocolOysterMeasurement._id;
            om.error = errorMessage;
            $rootScope.$broadcast('saveOysterMeasurementError');
            return false;
          });
        }, function(errorMessage) {
          delete om.protocolOysterMeasurement._id;
          om.error = errorMessage;
          $rootScope.$broadcast('saveOysterMeasurementError');
          return false;
        });
      }

      function errorCallback(res) {
        om.error = res.data.message;
        $rootScope.$broadcast('saveOysterMeasurementError');
      }
    };

    om.cancel = function() {
      $state.go('protocol-oyster-measurements.main');
    };

    om.openSubstrateForm = function(index) {
      $rootScope.$broadcast('stopSaving');
      var content = angular.element('#modal-substrateshell'+index);
      om.outerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto) ?
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.path : '';
      om.innerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto) ?
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.path : '';
      content.modal('show');
    };

    var saveSubstrateOuterImagesOnBlur = function(index, successCallback, errorCallback) {
      if (index && om.protocolOysterMeasurement._id && om.outerSubstrateURL !== '') {
        if (index < om.outerUploaders.length && om.outerUploaders[index]) {
          var uploader = om.outerUploaders[index];
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              uploader.removeFromQueue(fileItem);
              successCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
              om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.error = response.message;
              errorCallback();
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/index/' + index + '/upload-outer-substrate';
            };
            uploader.uploadAll();
          } else {
            successCallback();
          }
        } else {
          errorCallback();
        }
      } else if (index && om.protocolOysterMeasurement._id && om.outerSubstrateURL === '') {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.path = '';
        om.saveOnBlur(successCallback, errorCallback);
      }
    };

    var saveSubstrateInnerImagesOnBlur = function(index, successCallback, errorCallback) {
      if (index && om.protocolOysterMeasurement._id && om.innerSubstrateURL !== '') {
        if (index < om.innerUploaders.length && om.innerUploaders[index]) {
          var uploader = om.innerUploaders[index];
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              uploader.removeFromQueue(fileItem);
              successCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
              om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.error = response.message;
              errorCallback();
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/index/' + index + '/upload-inner-substrate';
            };
            uploader.uploadAll();
          } else {
            successCallback();
          }
        } else {
          successCallback();
        }
      } else if (index && om.protocolOysterMeasurement._id && om.innerSubstrateURL !== '') {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.path = '';
        om.saveOnBlur(successCallback, errorCallback);
      }
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

        om.saveOnBlur(function() {
          saveSubstrateOuterImagesOnBlur(index, function() {
            saveSubstrateInnerImagesOnBlur(index, function() {
              $rootScope.$broadcast('startSaving');
            }, function() {
              $rootScope.$broadcast('startSaving');
            });
          }, function() {
            $rootScope.$broadcast('startSaving');
          });
        }, function() {
          $rootScope.$broadcast('startSaving');
        });
      }
    };

    om.findSubstrateStats = function(substrate) {
      if (substrate.measurements && substrate.measurements.length > 0) {
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
      }
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

      if (min < Number.MAX_VALUE && max > Number.MIN_VALUE && count > 0 && totalSize > 0) {
        om.protocolOysterMeasurement.minimumSizeOfAllLiveOysters = min;
        om.protocolOysterMeasurement.maximumSizeOfAllLiveOysters = max;
        om.protocolOysterMeasurement.averageSizeOfAllLiveOysters = (totalSize/count);
        om.protocolOysterMeasurement.totalNumberOfAllLiveOysters = count;

        findPreviousValues();
      }
    };

    om.cancelSubstrateForm = function(index) {
      angular.element('#modal-substrateshell'+index).modal('hide');
      om.substrate = {};
      $rootScope.$broadcast('startSaving');
    };

    $scope.$on('incrementalSaveOysterMeasurement', function() {
      om.saveOnBlur();
    });

    om.saveOnBlur = function(successCallback, errorCallback) {
      if (om.protocolOysterMeasurement._id) {
        $http.post('/api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/incremental-save',
        om.protocolOysterMeasurement)
        .success(function (data, status, headers, config) {
          om.protocolOysterMeasurement = new ProtocolOysterMeasurementsService(data.oysterMeasurement);
          om.protocolOysterMeasurement.collectionTime = moment(om.protocolOysterMeasurement.collectionTime).startOf('minute').toDate();
          om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage &&
            om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
            om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
          if (data.errors) {
            om.error = data.errors;
            om.form.oysterMeasurementForm.$setSubmitted(true);
            $rootScope.$broadcast('incrementalSaveOysterMeasurementError');
          }
          if (data.successful) {
            om.error = null;
            $rootScope.$broadcast('incrementalSaveOysterMeasurementSuccessful');
          }
          if (successCallback) successCallback();
        })
        .error(function (data, status, headers, config) {
          om.error = data.message;
          om.form.oysterMeasurementForm.$setSubmitted(true);
          $rootScope.$broadcast('incrementalSaveOysterMeasurementError');
          if (errorCallback) errorCallback();
        });
      }
    };

    $scope.$watch('om.cageConditionPhotoURL', function(newValue, oldValue) {
      if (om.protocolOysterMeasurement._id && om.cageConditionPhotoURL !== '') {
        if (om.cageConditionUploader.queue.length > 0) {
          om.cageConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
            om.cageConditionUploader.removeFromQueue(fileItem);
            ProtocolOysterMeasurementsService.get({
              oysterMeasurementId: om.protocolOysterMeasurement._id
            }, function(data) {
              om.protocolOysterMeasurement = data;
              om.protocolOysterMeasurement.collectionTime = moment(om.protocolOysterMeasurement.collectionTime).startOf('minute').toDate();
              om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
                om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
            });
          };

          om.cageConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
            om.error = response.message;
          };

          om.cageConditionUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/upload-oyster-cage-condition';
          };
          om.cageConditionUploader.uploadAll();
        }
      } else if (om.protocolOysterMeasurement._id && om.cageConditionPhotoURL === '' &&
        om.protocolOysterMeasurement.conditionOfOysterCage &&
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) {
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path = '';
        om.saveOnBlur();
      }
    });

    $timeout(function() {
      om.saveOnBlur();
    }, 1000);

    om.openMap = function() {
      $rootScope.$broadcast('stopSaving');
    };

    om.closeMap = function() {
      $rootScope.$broadcast('startSaving');
    };
  }
})();
