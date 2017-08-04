(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .controller('ProtocolMobileTrapsController', ProtocolMobileTrapsController);

  ProtocolMobileTrapsController.$inject = ['$scope', '$rootScope', '$state', 'moment', '$http', '$stateParams', '$timeout',
    'lodash', 'FileUploader', 'ProtocolMobileTrapsService', 'MobileOrganismsService'];

  function ProtocolMobileTrapsController($scope, $rootScope, $state, moment, $http, $stateParams, $timeout,
    lodash, FileUploader, ProtocolMobileTrapsService, MobileOrganismsService) {

    $scope.foundOrganisms = {};

    var hideAllButOneBlank = function(organisms) {
      var blankShown = false;
      for (var i = 0; i < organisms.length; i++) {
        var organismId = organisms[i]._id;
        if (organisms[i].commonName === 'Other/Unknown' && $scope.foundOrganisms[organismId] &&
        $scope.foundOrganisms[organismId].sketchPhoto && $scope.foundOrganisms[organismId].sketchPhoto.path) {
          organisms[i].show = true;
        } else if (organisms[i].commonName === 'Other/Unknown' &&
        (!$scope.foundOrganisms[organismId] || !$scope.foundOrganisms[organismId].sketchPhoto ||
        !$scope.foundOrganisms[organismId].sketchPhoto.path)) {
          if (!blankShown) {
            organisms[i].show = true;
            blankShown = true;
          } else {
            organisms[i].show = false;
          }
        } else {
          organisms[i].show = true;
        }
      }
      return organisms;
    };

    // Set up Organisms
    $scope.filter = {
      category: ''
    };

    $scope.clearFilters = function() {
      $scope.filter = {
        category: ''
      };
      $scope.findOrganisms(function() {
        $scope.mobileOrganisms = hideAllButOneBlank($scope.mobileOrganisms);
      });
    };

    $scope.clickFilter = function(category) {
      $scope.filter = {
        category: category
      };
      $scope.findOrganisms(function() {
        $scope.mobileOrganisms = hideAllButOneBlank($scope.mobileOrganisms);
      });
    };

    $scope.findOrganisms = function(callback) {
      MobileOrganismsService.query({
        category: $scope.filter.category
      }, function(data) {
        $scope.mobileOrganisms = data;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
          if (callback) callback();
        });
      });
    };

    var getMobileOrganismById = function(organismId) {
      var index = lodash.findIndex($scope.mobileOrganisms, function(m) {
        return organismId === m._id;
      });
      return $scope.mobileOrganisms[index];
    };

    var setupMobileOrganisms = function(save, callback) {
      for (var i = 0; i < $scope.mobileTrap.mobileOrganisms.length; i++) {
        var organismDetails = $scope.mobileTrap.mobileOrganisms[i];
        var organismId = (organismDetails.organism && organismDetails.organism._id) ?
          organismDetails.organism._id : organismDetails.organism;
        if (organismDetails.organism && !organismDetails.organism._id) {
          organismDetails.organism = getMobileOrganismById(organismId);
        }
        if (!$scope.foundOrganisms[organismId]) {
          $scope.foundOrganisms[organismId] = {
            uploader: new FileUploader({ alias: 'newSketchPhotoPicture' }),
            count: 0,
            imageUrl: '',
            notes: '',
            organism: organismDetails.organism
          };
        }

        $scope.foundOrganisms[organismId].count = organismDetails.count;
        $scope.foundOrganisms[organismId].sketchPhoto = organismDetails.sketchPhoto;
        $scope.foundOrganisms[organismId].imageUrl = (organismDetails.sketchPhoto) ? organismDetails.sketchPhoto.path : '';
        $scope.foundOrganisms[organismId].notes = organismDetails.notesQuestions;
      }
      if (save) {
        $http.put('/api/protocol-mobile-traps/' + $scope.mobileTrap._id,
          $scope.mobileTrap)
          .success(function (data, status, headers, config) {
            if (callback) callback();
          })
          .error(function (data, status, headers, config) {
            if (callback) callback();
          });
      } else {
        if (callback) callback();
      }
    };

    if ($scope.mobileTrap) {
      // Set up initial values
      $scope.mobileTrap.collectionTime = moment($scope.mobileTrap.collectionTime).startOf('minute').toDate();
    }

    $scope.mobileOrganisms = $scope.findOrganisms(function() {
      if ($scope.mobileTrap) {
        for (var o = 0; o < $scope.mobileOrganisms.length; o++) {
          $scope.getFoundOrganism($scope.mobileOrganisms[o]);
        }

        if (!$scope.mobileTrap.mobileOrganisms) {
          $scope.mobileTrap.mobileOrganisms = [];
        } else {
          setupMobileOrganisms(true);
        }
        $scope.mobileOrganisms = hideAllButOneBlank($scope.mobileOrganisms);
      }
    });

    $scope.getFoundOrganism = function(organism) {
      if (!$scope.foundOrganisms[organism._id]) {
        $scope.foundOrganisms[organism._id] = {
          uploader: new FileUploader({ alias: 'newSketchPhotoPicture' }),
          count: 0,
          imageUrl: '',
          sketchPhoto: {},
          notes: '',
          organism: organism
        };
      }
      return $scope.foundOrganisms[organism._id];
    };

    var foundOrganismsToMobileOrganisms = function(imageErrorMessage) {
      var foundIds = [];
      $scope.mobileTrap.mobileOrganisms = [];
      for (var foundId in $scope.foundOrganisms) {
        var found = $scope.foundOrganisms[foundId];
        foundIds.push(foundId);
        if (found.count > 0) {
          $scope.mobileTrap.mobileOrganisms.push({
            organism: found.organism,
            count: found.count,
            notesQuestions: found.notes,
            sketchPhoto: found.sketchPhoto,
            imageUrl: found.imageUrl
          });
          if (!found.imageUrl || found.imageUrl === '') {
            imageErrorMessage = 'Image missing for mobile trap';
          }
        }
      }
      return foundIds;
    };

    $scope.addOrganism = function(organism) {
      var organismDetails = $scope.getFoundOrganism(organism);
      organismDetails.count = organismDetails.count+1;

      $scope.foundOrganisms[organism._id] = organismDetails;
    };

    $scope.removeOrganism = function(organism) {
      var organismDetails = $scope.getFoundOrganism(organism);
      organismDetails.count = organismDetails.count-1;
      if (organismDetails.count < 0) organismDetails.count = 0;

      $scope.foundOrganisms[organism._id] = organismDetails;
    };

    $scope.openOrganismDetails = function(organism) {
      var organismDetails = $scope.getFoundOrganism(organism);
      $scope.organismDetails = {
        count: organismDetails.count,
        imageUrl: organismDetails.imageUrl,
        notes: organismDetails.notes,
        sketchPhoto: organismDetails.sketchPhoto,
        organism: angular.copy(organismDetails.organism)
      };
      $scope.organismDetailsFileUploader = organismDetails.uploader;

      $scope.sketchPhotoUrl = ($scope.organismDetails.imageUrl) ? $scope.organismDetails.imageUrl : '';

      angular.element('#modal-organism-details-'+organism._id).modal('show');
    };

    $scope.saveOrganismDetails = function(organismDetails, organismId, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.organismDetailsForm');
        return false;
      } else {
        angular.element('#modal-organism-details-'+organismId).modal('hide');
        $timeout(function() {
          $scope.foundOrganisms[organismDetails.organism._id] = organismDetails;
          $scope.foundOrganisms[organismDetails.organism._id].sketchPhoto = {
            path: $scope.foundOrganisms[organismDetails.organism._id].imageUrl
          };

          $scope.organismDetails = {};
          $scope.sketchPhotoUrl = '';

          var imageErrorMessage = '';
          var foundIds = foundOrganismsToMobileOrganisms(imageErrorMessage);
          $scope.mobileOrganisms = hideAllButOneBlank($scope.mobileOrganisms);
          $timeout(function() {
            $rootScope.$broadcast('iso-method', { name:null, params:null });
          }, 500);
        });
      }
    };

    $scope.cancelOrganismDetails = function(organismId) {
      angular.element('#modal-organism-details-'+organismId).modal('hide');
      $timeout(function() {
        $scope.organismDetailsFileUploader.clearQueue();

        $scope.foundOrganisms[$scope.organismDetails.organism._id] = {
          count: $scope.organismDetails.count,
          imageUrl: $scope.organismDetails.imageUrl,
          sketchPhoto: $scope.organismDetails.sketchPhoto,
          notes: $scope.organismDetails.notes,
          organism: angular.copy($scope.organismDetails.organism),
          uploader: $scope.organismDetailsFileUploader
        };

        $scope.organismDetails = {};
        $scope.sketchPhotoUrl = '';
      });
    };

    $timeout(function() {
      if ($scope.mobileTrap && $scope.mobileTrap._id) {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      }
    }, 1000);

    $scope.saveMobileTrap = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.mobileTrapForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.mobileTrapForm.$valid');
      }

      var foundIds = [];
      $scope.mobileTrap.mobileOrganisms = [];
      for (var foundId in $scope.foundOrganisms) {
        var found = $scope.foundOrganisms[foundId];
        foundIds.push(foundId);
        if (found.count > 0) {
          var organism = {
            organism: found.organism,
            count: found.count,
            notesQuestions: found.notes,
          };
          organism.sketchPhoto = (found.sketchPhoto) ? found.sketchPhoto : {};
          organism.sketchPhoto.path = found.imageUrl;

          $scope.mobileTrap.mobileOrganisms.push(organism);
        }
      }

      var mobileTrapId = $scope.mobileTrap._id;

      $http.put('/api/protocol-mobile-traps/' + $scope.mobileTrap._id,
        $scope.mobileTrap)
        .success(function (data, status, headers, config) {
          saveImages(function() {
            save();
          });
        })
        .error(function (data, status, headers, config) {
          saveImages(function() {
            save();
          });
        });

      function saveImages(callback) {
        function uploadAllSketchPhotos(mobileTrapId, foundIds, sketchPhotosSuccessCallback, sketchPhotosErrorCallback) {
          function uploadSketchPhoto(mobileTrapId, index, foundIds, errorCount, uploadSketchPhotoCallback) {
            if (index < foundIds.length && foundIds[index]) {
              var organismId = foundIds[index];
              var uploader = $scope.foundOrganisms[organismId].uploader;
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploader.removeFromQueue(fileItem);
                  $scope.finishedSaving += Math.floor((1/foundIds.length)*15);
                  uploadSketchPhoto(mobileTrapId, index+1, foundIds, errorCount, uploadSketchPhotoCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  $scope.mobileTrap.mobileOrganisms[index].sketchPhoto.error = response.message;
                  errorCount++;
                  $scope.finishedSaving += Math.floor((1/foundIds.length)*15);
                  uploadSketchPhoto(mobileTrapId, index+1, foundIds, errorCount, uploadSketchPhotoCallback);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-mobile-traps/' + mobileTrapId + '/organisms/' + organismId + '/upload-sketch-photo';
                  var organism = getMobileOrganismById(organismId);
                  var organismName = (organism) ? organism.commonName : 'organism';
                  $scope.savingStatus = 'Saving Mobile Trap: Uploading sketch or photo for ' + organismName;
                };
                uploader.uploadAll();
              } else {
                uploadSketchPhoto(mobileTrapId, index+1, foundIds, errorCount, uploadSketchPhotoCallback);
              }
            } else {
              uploadSketchPhotoCallback(errorCount);
            }
          }

          uploadSketchPhoto(mobileTrapId, 0, foundIds, 0, function(errorCount) {
            if (errorCount) {
              sketchPhotosErrorCallback('Error uploading sketch or photo for organism');
            } else {
              sketchPhotosSuccessCallback();
            }
          });
        }

        uploadAllSketchPhotos(mobileTrapId, foundIds, function() {
          var updatedProtocol = ProtocolMobileTrapsService.get({
            mobileTrapId: $scope.mobileTrap._id
          }, function(data) {
            if (data.mobileOrganisms) {
              var organisms = data.mobileOrganisms;
              for (var i = 0; i < organisms.length; i++) {
                $scope.mobileTrap.mobileOrganisms[i].sketchPhoto = organisms[i].sketchPhoto;
              }
              setupMobileOrganisms(false, function() {
                callback();
              });
            } else {
              callback();
            }
          });
        }, function(errorMessage) {
          $scope.mobileTrapErrors = errorMessage;
          callback();
        });
      }

      function save() {
        $scope.savingStatus = 'Saving Mobile Trap';
        $http.put('/api/protocol-mobile-traps/' + mobileTrapId,
          $scope.mobileTrap)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.mobileTrapForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              $scope.mobileTrapErrors = null;
              successCallback();
            }
          })
          .error(function (data, status, headers, config) {
            $scope.form.mobileTrapForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.mobileTrapErrors = null;
        saveSuccessCallback();
      }

      function errorCallback(errorMessage) {
        if ($scope.mobileTrapErrors && $scope.mobileTrapErrors !== '') {
          $scope.mobileTrapErrors += '\n' + errorMessage;
        } else {
          $scope.mobileTrapErrors = errorMessage;
        }
        saveErrorCallback();
      }
    };

    $scope.validateMobileTrap = function(validateSuccessCallback, validateErrorCallback) {
      if ($scope.mobileTrap && $scope.mobileTrap._id) {
        $http.post('/api/protocol-mobile-traps/' + $scope.mobileTrap._id + '/validate',
          $scope.mobileTrap)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.mobileTrapForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              successCallback();
            }
          })
          .error(function (data, status, headers, config) {
            $scope.form.mobileTrapForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.mobileTrapErrors = null;
        validateSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.mobileTrapErrors = errorMessage;
        validateErrorCallback();
      }
    };

    $scope.$on('$viewContentLoaded', function(){
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      }, 500);
    });

    $scope.openViewUserModal = function() {
      angular.element('#modal-profile-user').modal('show');
    };

    $scope.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
})();
