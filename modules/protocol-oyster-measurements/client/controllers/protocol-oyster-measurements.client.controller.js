(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsController', ProtocolOysterMeasurementsController);

  ProtocolOysterMeasurementsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
    'lodash', 'Authentication', 'FileUploader', 'ProtocolOysterMeasurementsService', 'BioaccumulationService', 'TeamMembersService'];

  function ProtocolOysterMeasurementsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, Authentication, FileUploader, ProtocolOysterMeasurementsService, BioaccumulationService, TeamMembersService) {
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
      measurements.push({
        sizeOfLiveOysterMM: null
      });

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

      if (om && om.protocolOysterMeasurement && om.protocolOysterMeasurement._id) {
        $http.post('/api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/incremental-save',
        om.protocolOysterMeasurement)
        .success(function (data, status, headers, config) {
          if (data.scribe) {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Oyster Measurements',
                protocol: 'protocol2'
              }
            });
          }
          $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
        })
        .error(function (data, status, headers, config) {
        });
      }
    };

    var readFromScope = function() {
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
      $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
    };

    $scope.$on('readOysterMeasurementFromScope', function() {
      readFromScope();
    });

    // Set up Protocol Oyster Measurements
    om.protocolOysterMeasurement = {};
    if ($stateParams.protocolOysterMeasurementId) {
      ProtocolOysterMeasurementsService.get({
        oysterMeasurementId: $stateParams.protocolOysterMeasurementId
      }, function(data) {
        $scope.protocolOysterMeasurement = data;
        readFromScope();
      });
    } else if ($scope.protocolOysterMeasurement) {
      readFromScope();
    } else {
      om.cageConditionPhotoURL = '';
      $scope.protocolOysterMeasurement = new ProtocolOysterMeasurementsService();
      readFromScope();
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

    om.openSubstrateForm = function(index) {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
      var content = angular.element('#modal-substrateshell'+index);
      om.outerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto) ?
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.path : '';
      om.innerSubstrateURL = (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto) ?
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.path : '';
      if (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell === 0) {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell = 1;
      }
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
        $rootScope.$broadcast('savingStart');
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
          $timeout(function() {
            saveSubstrateOuterImagesOnBlur(index, function() {
              $timeout(function() {
                saveSubstrateInnerImagesOnBlur(index, function() {
                  $timeout(function() {
                    ProtocolOysterMeasurementsService.get({
                      oysterMeasurementId: om.protocolOysterMeasurement._id
                    }, function(data) {
                      if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
                        $rootScope.$broadcast('removeSubmittedProtocolTab', {
                          values: {
                            scribeName: data.scribeMember.displayName,
                            protocolName: 'Oyster Measurements',
                            protocol: 'protocol2'
                          }
                        });
                        $scope.protocolOysterMeasurement = null;
                      } else {
                        if (!om.protocolOysterMeasurement.measuringOysterGrowth) {
                          om.protocolOysterMeasurement.measuringOysterGrowth = {};
                        }
                        if (!om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells) {
                          om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells = [];
                        }
                        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto =
                          data.measuringOysterGrowth.substrateShells[index].outerSidePhoto;
                        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto =
                          data.measuringOysterGrowth.substrateShells[index].innerSidePhoto;
                        //angular.element('#modal-substrateshell'+index).modal('hide');
                        $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
                        readFromScope();
                      }
                      $rootScope.$broadcast('savingStop');
                      $rootScope.$broadcast('startIncrementalSavingLoop');
                    });
                  }, 1000);
                }, function() {
                  //angular.element('#modal-substrateshell'+index).modal('hide');
                  $rootScope.$broadcast('savingStop');
                  $rootScope.$broadcast('startIncrementalSavingLoop');
                });
              }, 2000);
            }, function() {
              //angular.element('#modal-substrateshell'+index).modal('hide');
              $rootScope.$broadcast('savingStop');
              $rootScope.$broadcast('startIncrementalSavingLoop');
            });
          }, 1000);
        }, function() {
          //angular.element('#modal-substrateshell'+index).modal('hide');
          $rootScope.$broadcast('savingStop');
          $rootScope.$broadcast('startIncrementalSavingLoop');
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
      if (om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell === 1 &&
      !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].minimumSizeOfLiveOysters &&
      !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].maximumSizeOfLiveOysters &&
      !om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].averageSizeOfLiveOysters) {
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell = 0;
      }
      om.substrate = {};
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };

    $scope.$on('saveValuesToScope', function() {
      $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
    });

    $scope.$on('incrementalSaveOysterMeasurement', function() {
      om.saveOnBlur();
    });

    om.saveOnBlur = function(successCallback, errorCallback) {
      if (om.protocolOysterMeasurement._id && ((om.form.oysterMeasurementForm.$touched && om.form.oysterMeasurementForm.$dirty) ||
        om.form.oysterMeasurementForm.$valid || ((om.protocolOysterMeasurement.depthOfOysterCage !== undefined &&
        om.protocolOysterMeasurement.depthOfOysterCage.submergedDepthofCageM > 0) ||
        (om.protocolOysterMeasurement.conditionOfOysterCage !== undefined &&
        om.protocolOysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage !== undefined) ||
        (om.cageConditionPhotoURL !== undefined && om.cageConditionPhotoURL !== null && om.cageConditionPhotoURL !== '') ||
        (om.protocolOysterMeasurement.measuringOysterGrowth !== undefined &&
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells !== undefined &&
        om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells.length > 0 &&
        om.checkDone(om.protocolOysterMeasurement.measuringOysterGrowth.substrateShells[0]))))) {
        $rootScope.$broadcast('savingStart');
        $http.post('/api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/incremental-save',
        om.protocolOysterMeasurement)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            om.error = data.errors;
            om.form.oysterMeasurementForm.$setSubmitted(true);
            $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
            readFromScope();
            $rootScope.$broadcast('incrementalSaveOysterMeasurementError');
          } else if (data.scribe) {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Oyster Measurements',
                protocol: 'protocol2'
              }
            });
            $scope.protocolOysterMeasurement = null;
          } else if (data.successful) {
            om.error = null;
            $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
            readFromScope();
            $rootScope.$broadcast('incrementalSaveOysterMeasurementSuccessful');
          }
          $rootScope.$broadcast('savingStop');
          if (successCallback) successCallback();
        })
        .error(function (data, status, headers, config) {
          om.error = data.message;
          om.form.oysterMeasurementForm.$setSubmitted(true);
          $rootScope.$broadcast('incrementalSaveOysterMeasurementError');
          $rootScope.$broadcast('savingStop');
          if (errorCallback) errorCallback();
        });
      } else {
        $rootScope.$broadcast('savingStop');
        if (successCallback) successCallback();
      }
    };

    $scope.$watch('om.cageConditionPhotoURL', function(newValue, oldValue) {
      if (om.protocolOysterMeasurement._id && om.cageConditionPhotoURL !== '') {
        if (om.cageConditionUploader.queue.length > 0) {
          var spinner;
          om.cageConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
            om.cageConditionUploader.removeFromQueue(fileItem);
            ProtocolOysterMeasurementsService.get({
              oysterMeasurementId: om.protocolOysterMeasurement._id
            }, function(data) {
              if (data && data.scribeMember && data.scribeMember.username !== Authentication.user.username &&
                data.status === 'submitted') {
                $rootScope.$broadcast('removeSubmittedProtocolTab', {
                  values: {
                    scribeName: data.scribeMember.displayName,
                    protocolName: 'Oyster Measurements',
                    protocol: 'protocol2'
                  }
                });
                $scope.protocolOysterMeasurement = null;
              } else {
                if (!om.protocolOysterMeasurement.conditionOfOysterCage) {
                  om.protocolOysterMeasurement.conditionOfOysterCage = {};
                }
                om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto = data.conditionOfOysterCage.oysterCagePhoto;
                om.cageConditionPhotoURL = (om.protocolOysterMeasurement.conditionOfOysterCage &&
                  om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
                  om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
                $scope.protocolOysterMeasurement = om.protocolOysterMeasurement;
                readFromScope();
              }
              $rootScope.$broadcast('savingStop');
              spinner.stop();
            });
          };

          om.cageConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
            om.error = response.message;
            $rootScope.$broadcast('savingStop');
            spinner.stop();
          };

          om.cageConditionUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/protocol-oyster-measurements/' + om.protocolOysterMeasurement._id + '/upload-oyster-cage-condition';
          };
          $rootScope.$broadcast('savingStart');
          spinner = new Spinner({}).spin(document.getElementById('oyster-cage-condition-image-dropzone'));
          om.cageConditionUploader.uploadAll();
        }
      } else if (om.protocolOysterMeasurement._id && om.cageConditionPhotoURL === '' &&
        om.protocolOysterMeasurement.conditionOfOysterCage &&
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto) {
        $rootScope.$broadcast('savingStart');
        om.protocolOysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path = '';
        om.saveOnBlur();
      }
    });

    $timeout(function() {
      if (om && om.protocolOysterMeasurement && om.protocolOysterMeasurement._id) {
        om.saveOnBlur();
        $rootScope.$broadcast('startIncrementalSavingLoop');
      }
    }, 500);

    om.openMap = function() {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
    };

    om.closeMap = function() {
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };
  }
})();
