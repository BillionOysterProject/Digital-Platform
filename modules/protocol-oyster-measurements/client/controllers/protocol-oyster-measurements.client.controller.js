(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsController', ProtocolOysterMeasurementsController);

  ProtocolOysterMeasurementsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
    'lodash', 'ProtocolOysterMeasurementsService', 'BioaccumulationService'];

  function ProtocolOysterMeasurementsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, ProtocolOysterMeasurementsService, BioaccumulationService) {

    // Check to see if substrate is complete
    $scope.checkDone = function(substrate) {
      if ((substrate.totalNumberOfLiveOystersOnShell === 0 ||
        (substrate.totalNumberOfLiveOystersOnShell > 0 && substrate.minimumSizeOfLiveOysters > 0 &&
      substrate.maximumSizeOfLiveOysters > 0 && substrate.averageSizeOfLiveOysters > 0)) &&
      substrate.source && substrate.setDate) {
        return true;
      } else {
        return false;
      }
    };

    // Set up substrate shells
    var setupSubstrateShells = function(callback) {
      var measurements = [];
      measurements.push({
        sizeOfLiveOysterMM: null
      });

      if ($scope.oysterMeasurement.measuringOysterGrowth &&
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells &&
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length > 0) {
        for (var h = 0; h < $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length; h++) {
          $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[h].substrateShellNumber = h+1;
        }
      } else {
        $scope.oysterMeasurement.measuringOysterGrowth = {
          substrateShells: []
        };
      }

      var totalToAdd = $scope.substrateCount - $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length;
      for (var i = 1; i <= totalToAdd; i++) {
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.push({
          substrateShellNumber: i,
          totalNumberOfLiveOystersAtBaseline: 0,
          totalNumberOfLiveOystersOnShell: 0,
          totalMassOfScrubbedSubstrateShellOystersTagG: 0,
          measurements: angular.copy(measurements),
          done: false
        });
      }
      $http.post('/api/protocol-oyster-measurements/' + $scope.oysterMeasurement._id + '/incremental-save',
        $scope.oysterMeasurement)
        .success(function (data, status, headers, config) {
          if (callback) callback();
        })
        .error(function (data, status, headers, config) {
          if (callback) callback();
        });
    };

    var findPreviousValues = function() {
      if ($scope.oysterMeasurement._id) {
        $http.get('/api/protocol-oyster-measurements/' + $scope.oysterMeasurement._id + '/previous')
        .success(function (data, status, headers, config) {
          if ($scope.oysterMeasurement.totalNumberOfAllLiveOysters && data.totalNumberOfAllLiveOysters &&
          $scope.oysterMeasurement.averageSizeOfAllLiveOysters && data.averageSizeOfAllLiveOysters &&
          $scope.oysterMeasurement.minimumSizeOfAllLiveOysters && data.minimumSizeOfAllLiveOysters &&
          $scope.oysterMeasurement.maximumSizeOfAllLiveOysters && data.maximumSizeOfAllLiveOysters) {
            var mortality = ((($scope.oysterMeasurement.totalNumberOfAllLiveOysters - data.totalNumberOfAllLiveOysters) / data.totalNumberOfAllLiveOysters)*-100).toFixed(2);
            var growth = ((($scope.oysterMeasurement.averageSizeOfAllLiveOysters - data.averageSizeOfAllLiveOysters) / data.averageSizeOfAllLiveOysters)*100).toFixed(2);
            var min = ((($scope.oysterMeasurement.minimumSizeOfAllLiveOysters - data.minimumSizeOfAllLiveOysters) / data.minimumSizeOfAllLiveOysters)*100).toFixed(2);
            var max = ((($scope.oysterMeasurement.maximumSizeOfAllLiveOysters - data.maximumSizeOfAllLiveOysters) / data.maximumSizeOfAllLiveOysters)*100).toFixed(2);
            $scope.previous = {
              mortality: mortality,
              growth: growth,
              min: min,
              max: max,
              avgSize: data.averageSizeOfAllLiveOysters,
              total: data.totalNumberOfAllLiveOysters
            };
          }
          if (data && data.measuringOysterGrowth && data.measuringOysterGrowth.substrateShells) {
            for (var i = 0; i < data.measuringOysterGrowth.substrateShells.length; i++) {
              var prevShell = data.measuringOysterGrowth.substrateShells[i];
              if (prevShell && prevShell.setDate && prevShell.source && prevShell.totalNumberOfLiveOystersAtBaseline) {
                var shell = $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i];
                if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i]) {
                  $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.push({
                    substrateShellNumber: i,
                    setDate: moment(prevShell.setDate).startOf('day').toDate(),
                    source: prevShell.source,
                    sourceOther: prevShell.sourceOther,
                    totalNumberOfLiveOystersAtBaseline: prevShell.totalNumberOfLiveOystersAtBaseline,
                    totalNumberOfLiveOystersOnShell: 0,
                    totalMassOfScrubbedSubstrateShellOystersTagG: 0,
                    measurements: [],
                    done: false
                  });
                } else if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].source) {
                  if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate && prevShell.setDate) {
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].setDate =
                      moment(prevShell.setDate).startOf('day').toDate();
                  }
                  if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].source && prevShell.source) {
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].source = prevShell.source;
                  }
                  if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].otherSource && prevShell.otherSource) {
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].otherSource = prevShell.otherSource;
                  }
                  if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].totalNumberOfLiveOystersAtBaseline &&
                    prevShell.totalNumberOfLiveOystersAtBaseline) {
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].totalNumberOfLiveOystersAtBaseline =
                      prevShell.totalNumberOfLiveOystersAtBaseline;
                  }
                }
              }
            }
          }
        })
        .error(function (data, status, headers, config) {
          console.log('Could not find previous');
        });
      }
    };


    // Set up initial values
    $scope.oysterMeasurement.collectionTime = moment($scope.oysterMeasurement.collectionTime).startOf('minute').toDate();
    $scope.cageConditionPhotoURL = ($scope.oysterMeasurement && $scope.oysterMeasurement.conditionOfOysterCage &&
      $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto) ?
      $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
    if (!$scope.oysterMeasurement.measuringOysterGrowth ||
      !$scope.oysterMeasurement.measuringOysterGrowth.substrateShells) {
      setupSubstrateShells(findPreviousValues());
    } else if ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length < $scope.substrateCount) {
      for (var j = 0; j < $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length; j++) {
        if ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[j].setDate) {
          $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[j].setDate =
            moment($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[j].setDate).startOf('day').toDate();
        }
      }
      setupSubstrateShells(findPreviousValues());
    } else {
      for (var k = 0; k < $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length; k++) {
        if ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[k].setDate) {
          $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[k].setDate =
            moment($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[k].setDate).startOf('day').toDate();
        }
      }
      findPreviousValues();
    }

    // Get the values for the dropdowns
    $scope.bioaccumulations = BioaccumulationService.query();

    $scope.openSubstrateForm = function(index) {
      $scope.substrate = angular.copy($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index]);

      $scope.outerSubstrateURL = ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto) ?
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.path : '';
      $scope.innerSubstrateURL = ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto) ?
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.path : '';
      if ($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell === undefined) {
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].totalNumberOfLiveOystersOnShell = 0;
      }

      angular.element('#modal-substrateshell'+index).modal('show');
    };

    $scope.saveSubstrateForm = function(substrate, index, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
        return false;
      } else {
        angular.element('#modal-substrateshell'+index).modal('hide');
        $timeout(function(){
          substrate = $scope.findSubstrateStats(substrate);

          $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[substrate.substrateShellNumber-1] = angular.copy(substrate);
          $scope.substrate = {};
          $scope.outerSubstrateURL = '';
          $scope.innerSubstrateURL = '';

          $scope.findOverallStats();
        }, 500);
      }
    };

    $scope.findSubstrateStats = function(substrate) {
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

        substrate.minimumSizeOfLiveOysters = (min === Number.MAX_VALUE) ? 0 : min;
        substrate.maximumSizeOfLiveOysters = (max === Number.MIN_VALUE) ? 0 : max;
        substrate.averageSizeOfLiveOysters = (totalSize === 0 && count === 0) ? 0 : (totalSize/count);
      }
      return substrate;
    };

    $scope.findOverallStats = function() {
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var count = 0;
      var totalSize = 0;

      for (var i = 0; i < $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
        var substrate = $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i];
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
        $scope.oysterMeasurement.minimumSizeOfAllLiveOysters = min;
        $scope.oysterMeasurement.maximumSizeOfAllLiveOysters = max;
        $scope.oysterMeasurement.averageSizeOfAllLiveOysters = (totalSize/count);
        $scope.oysterMeasurement.totalNumberOfAllLiveOysters = count;

        findPreviousValues();
      }
    };

    $scope.cancelSubstrateForm = function(index) {
      angular.element('#modal-substrateshell'+index).modal('hide');
      $timeout(function() {
        $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index] = angular.copy($scope.substrate);

        $scope.substrate = {};
        $scope.outerUploaders[index].clearQueue();
        $scope.innerUploaders[index].clearQueue();
        $scope.outerSubstrateURL = '';
        $scope.innerSubstrateURL = '';
      }, 500);
    };

    // Check to see if any of the substrate shells are done
    // var checkAnyDone = function() {
    //   for (var i = 0; i < $scope.substrateCount; i++) {
    //     if ($scope.checkDone($scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i])) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };
    // checkAnyDone();

    $scope.saveOysterMeasurement = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.oysterMeasurementForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.oysterMeasurementForm');
      }

      var substratesValid = true;
      for (var i = 0; i < $scope.oysterMeasurement.measuringOysterGrowth.substrateShells.length; i++) {
        if (!$scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].source) {
          substratesValid = false;
        }
      }
      if (!substratesValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.oysterMeasurementForm');
      }

      // if ($scope.cageConditionPhotoURL !== '' && $scope.oysterMeasurement) {
      //   if ($scope.oysterMeasurement && $scope.oysterMeasurement.conditionOfOysterCage &&
      //     $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto &&
      //     $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path) {
      //     $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path = $scope.cageConditionPhotoURL;
      //   } else if (!$scope.oysterMeasurement.conditionOfOysterCage) {
      //     $scope.oysterMeasurement.conditionOfOysterCage = {
      //       oysterCagePhoto: {
      //         path: $scope.cageConditionPhotoURL
      //       }
      //     };
      //   } else {
      //     $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto = {
      //       path: $scope.cageConditionPhotoURL
      //     };
      //   }
      // }

      var oysterMeasurementId = $scope.oysterMeasurement._id;

      saveImages(function() {
        save();
      });

      function saveImages(callback) {
        function uploadCageConditionPhoto(oysterMeasurementId, cagePhotoSuccessCallback, cagePhotoErrorCallback) {
          if ($scope.cageConditionUploader.queue.length > 0) {
            $scope.cageConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.cageConditionUploader.removeFromQueue(fileItem);

              var updatedProtocol = ProtocolOysterMeasurementsService.get({
                oysterMeasurementId: $scope.oysterMeasurement._id
              }, function(data) {
                if (data.conditionOfOysterCage && data.conditionOfOysterCage.oysterCagePhoto) {
                  if (!$scope.oysterMeasurement.conditionOfOysterCage) {
                    $scope.oysterMeasurement.conditionOfOysterCage = {
                      oysterCagePhoto: {}
                    };
                  }
                  $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto = data.conditionOfOysterCage.oysterCagePhoto;
                  $scope.cageConditionPhotoURL = ($scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto &&
                    $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path) ?
                    $scope.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path : '';
                }

                cagePhotoSuccessCallback();
              });
            };

            $scope.cageConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
              cagePhotoErrorCallback(response.message);
            };

            $scope.cageConditionUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/upload-oyster-cage-condition';
            };
            $scope.cageConditionUploader.uploadAll();
          } else {
            cagePhotoSuccessCallback();
          }
        }

        function uploadAllOuterPhotos(oysterMeasurementId, outerPhotosSuccessCallback, outerPhotosErrorCallback) {
          function uploadOuterPhoto(oysterMeasurementId, index, errorCount, uploadOuterPhotoCallback) {
            if (index < $scope.outerUploaders.length && $scope.outerUploaders[index]) {
              var uploader = $scope.outerUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploader.removeFromQueue(fileItem);
                  uploadOuterPhoto(oysterMeasurementId, index+1, errorCount, uploadOuterPhotoCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].outerSidePhoto.error = response.message;
                  errorCount++;
                  uploadOuterPhoto(oysterMeasurementId, index+1, errorCount, uploadOuterPhotoCallback);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/index/' + index + '/upload-outer-substrate';
                };
                uploader.uploadAll();
              } else {
                uploadOuterPhoto(oysterMeasurementId, index+1, errorCount, uploadOuterPhotoCallback);
              }
            } else {
              uploadOuterPhotoCallback(errorCount);
            }
          }

          uploadOuterPhoto(oysterMeasurementId, 0, 0, function(errorCount) {
            if (errorCount > 0) {
              outerPhotosErrorCallback('Error uploading outer side photo for Substrate Shells');
            } else {
              outerPhotosSuccessCallback();
            }
          });
        }

        function uploadAllInnerPhotos(oysterMeasurementId, innerPhotosSuccessCallback, innerPhotosErrorCallback) {
          function uploadInnerPhoto(oysterMeasurementId, index, errorCount, uploadInnerPhotoCallback) {
            if (index < $scope.innerUploaders.length && $scope.innerUploaders[index]) {
              var uploader = $scope.innerUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploader.removeFromQueue(fileItem);
                  uploadInnerPhoto(oysterMeasurementId, index+1, errorCount, uploadInnerPhotoCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[index].innerSidePhoto.error = response.message;
                  errorCount++;
                  uploadInnerPhoto(oysterMeasurementId, index+1, errorCount, uploadInnerPhotoCallback);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-oyster-measurements/' + oysterMeasurementId + '/index/' + index + '/upload-inner-substrate';
                };
                uploader.uploadAll();
              } else {
                uploadInnerPhoto(oysterMeasurementId, index+1, errorCount, uploadInnerPhotoCallback);
              }
            } else {
              uploadInnerPhotoCallback(errorCount);
            }
          }

          uploadInnerPhoto(oysterMeasurementId, 0, 0, function(errorCount) {
            if (errorCount > 0) {
              innerPhotosErrorCallback('Error uploading inner side photos for Substrate Shells');
            } else {
              innerPhotosSuccessCallback();
            }
          });
        }

        function saveCageCondition(saveCallback) {
          uploadCageConditionPhoto(oysterMeasurementId, function() {
            saveCallback();
          }, function(errorMessage) {
            $scope.oysterMeasurementErrors = errorMessage;
            saveCallback();
          });
        }

        function saveOuterPhotos(saveCallback) {
          uploadAllOuterPhotos(oysterMeasurementId, function() {
            saveCallback();
          }, function(errorMessage) {
            $scope.oysterMeasurementErrors = errorMessage;
            saveCallback();
          });
        }

        function saveInnerPhotos(saveCallback) {
          uploadAllInnerPhotos(oysterMeasurementId, function() {
            saveCallback();
          }, function(errorMessage) {
            $scope.oysterMeasurementErrors = errorMessage;
            saveCallback();
          });
        }

        saveCageCondition(function() {
          saveOuterPhotos(function() {
            saveInnerPhotos(function() {
              var updatedProtocol = ProtocolOysterMeasurementsService.get({
                oysterMeasurementId: $scope.oysterMeasurement._id
              }, function(data) {
                if (data.measuringOysterGrowth && data.measuringOysterGrowth.substrateShells) {
                  var substrateShells = data.measuringOysterGrowth.substrateShells;
                  for (var i = 0; i < substrateShells.length; i++) {
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].outerSidePhoto =
                      substrateShells[i].outerSidePhoto;
                    $scope.oysterMeasurement.measuringOysterGrowth.substrateShells[i].innerSidePhoto =
                      substrateShells[i].innerSidePhoto;
                  }
                }
                callback();
              });
            });
          });
        });
      }

      function save() {
        $http.post('/api/protocol-oyster-measurements/' + oysterMeasurementId + '/incremental-save',
          $scope.oysterMeasurement)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.oysterMeasurementForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              $scope.oysterMeasurementErrors = null;
              successCallback();
            }
          })
          .error(function (data, status, headers, config) {
            $scope.form.oysterMeasurementForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.oysterMeasurementErrors = null;
        saveSuccessCallback();
      }

      function errorCallback(errorMessage) {
        if ($scope.oysterMeasurementErrors && $scope.oysterMeasurementErrors !== '') {
          $scope.oysterMeasurementErrors += '\n' + errorMessage;
        } else {
          $scope.oysterMeasurementErrors = errorMessage;
        }
        saveErrorCallback();
      }
    };

    $scope.validateOysterMeasurement = function(validateSuccessCallback, validateErrorCallback) {
      if ($scope.oysterMeasurement && $scope.oysterMeasurement._id) {
        $http.post('/api/protocol-oyster-measurements/' + $scope.oysterMeasurement._id + '/validate',
          $scope.oysterMeasurement)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.oysterMeasurementForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              successCallback();
            }
          })
          .error(function (data, status, headers, config) {
            $scope.form.oysterMeasurementForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.oysterMeasurementErrors = null;
        validateSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.siteConditionErrors = errorMessage;
        validateErrorCallback();
      }
    };
  }
})();
