(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .controller('ProtocolMobileTrapsController', ProtocolMobileTrapsController);

  ProtocolMobileTrapsController.$inject = ['$scope', '$state', 'moment', '$http', 'Authentication', '$stateParams',
    'FileUploader', 'ProtocolMobileTrapsService', 'MobileOrganismsService', 'TeamMembersService'];

  function ProtocolMobileTrapsController($scope, $state, moment, $http, Authentication, $stateParams,
    FileUploader, ProtocolMobileTrapsService, MobileOrganismsService, TeamMembersService) {
    var mt = this;

    // Set up Organisms
    mt.filter = {
      category: ''
    };

    mt.clearFilters = function() {
      mt.filter = {
        category: ''
      };
      mt.findOrganisms();
    };

    mt.clickFilter = function(category) {
      mt.filter = {
        category: category
      };
      mt.findOrganisms();
    };

    mt.findOrganisms = function(callback) {
      MobileOrganismsService.query({
        category: mt.filter.category
      }, function(data) {
        mt.mobileOrganisms = data;
        if (callback) callback();
      });
    };

    mt.getFoundOrganism = function(organism) {
      if (!mt.foundOrganisms[organism._id]) {
        console.log('adding new found organism');
        mt.foundOrganisms[organism._id] = {
          uploader: new FileUploader({ alias: 'newSketchPhotoPicture' }),
          count: 0,
          imageUrl: '',
          notes: '',
          organism: organism
        };
      }
      return mt.foundOrganisms[organism._id];
    };

    var setupMobileOrganisms = function() {
      for (var i = 0; i < mt.protocolMobileTrap.mobileOrganisms.length; i++) {
        var organismDetails = mt.protocolMobileTrap.mobileOrganisms[i];
        var organismId = (organismDetails.organism && organismDetails.organism._id) ?
          organismDetails.organism._id : organismDetails.organism;
        console.log('organismId', organismId);
        var foundOrganism = mt.getFoundOrganism(organismId);

        foundOrganism.count = organismDetails.count;
        foundOrganism.imageUrl = (organismDetails.sketchPhoto) ? organismDetails.sketchPhoto.path : '';
        foundOrganism.notes = organismDetails.notesQuestions;
        console.log('foundOrganism', foundOrganism);
      }
      angular.element('#isotope-container').isotope();
    };

    mt.foundOrganisms = {};
    mt.mobileOrganisms = mt.findOrganisms(function() {
      for (var o = 0; o < mt.mobileOrganisms.length; o++) {
        mt.getFoundOrganism(mt.mobileOrganisms[o]);
      }

      // Set up Protocol Mobile Traps
      mt.protocolMobileTrap = {};
      if ($stateParams.protocolMobileTrapId) {
        ProtocolMobileTrapsService.get({
          mobileTrapId: $stateParams.protocolMobileTrapId
        }, function(data) {
          mt.protocolMobileTrap = data;
          mt.protocolMobileTrap.collectionTime = moment(mt.protocolMobileTrap.collectionTime).toDate();
          setupMobileOrganisms();
        });
      } else if ($scope.protocolMobileTrap) {
        mt.protocolMobileTrap = $scope.protocolMobileTrap;
        mt.protocolMobileTrap.collectionTime = moment(mt.protocolMobileTrap.collectionTime).toDate();
        if (!mt.protocolMobileTrap.mobileOrganisms) {
          mt.protocolMobileTrap.mobileOrganisms = [];
        } else {
          setupMobileOrganisms();
        }
        console.log('mobileTrap', mt.protocolMobileTrap);
      } else {
        mt.protocolMobileTrap = new ProtocolMobileTrapsService();
        mt.protocolMobileTrap.mobileOrganisms = [];
      }
    });

    mt.authentication = Authentication;
    mt.error = null;
    mt.form = {};

    mt.teamMemberSelectConfig = {
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

    mt.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    // Remove existing protocol mobile trap
    mt.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        mt.protocolMobileTrap.$remove($state.go('protocol-mobile-traps.main'));
      }
    };

    var foundOrganismsToMobileOrganisms = function(imageErrorMessage) {
      var foundIds = [];
      mt.protocolMobileTrap.mobileOrganisms = [];
      for (var foundId in mt.foundOrganisms) {
        var found = mt.foundOrganisms[foundId];
        foundIds.push(foundId);
        if (found.count > 0) {
          mt.protocolMobileTrap.mobileOrganisms.push({
            organism: found.organism,
            count: found.count,
            notesQuestions: found.notes,
            sketchPhoto: {
              path: found.imageUrl
            }
          });
          if (!found.imageUrl || found.imageUrl === '') {
            imageErrorMessage = 'Image missing for mobile trap';
          }
        }
      }
      return foundIds;
    };

    // Save protocol mobile trap
    mt.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'mt.form.protocolMobileTrapForm');
        return false;
      }

      var imageErrorMessage = '';
      var foundIds = foundOrganismsToMobileOrganisms(imageErrorMessage);

      if (imageErrorMessage !== '') {
        mt.error = imageErrorMessage;
        return false;
      }

      // TODO: move create/update logic to service
      if (mt.protocolMobileTrap._id) {
        mt.protocolMobileTrap.$update(successCallback, errorCallback);
      } else {
        mt.protocolMobileTrap.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var mobileTrapId = res._id;

        function goToView(mobileTrapId) {
          $state.go('protocol-mobile-traps.view', {
            protocolMobileTrapId: mobileTrapId
          });
        }

        function uploadAllSketchPhotos(mobileTrapId, foundIds, sketchPhotosSuccessCallback, sketchPhotosErrorCallback) {
          function uploadSketchPhoto(mobileTrapId, index, foundIds, sketchPhotoSuccessCallback, sketchPhotoErrorCallback) {
            if (index < foundIds.length && foundIds[index]) {
              var organismId = foundIds[index];
              var uploader = mt.foundOrganisms[organismId].uploader;
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadSketchPhoto(mobileTrapId, index+1, foundIds, sketchPhotoSuccessCallback, sketchPhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  mt.protocolMobileTrap.mobileOrganisms[index].sketchPhoto.error = response.message;
                  sketchPhotoErrorCallback(organismId);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-mobile-traps/' + mobileTrapId + '/organisms/' + organismId + '/upload-sketch-photo';
                };
                uploader.uploadAll();
              } else {
                uploadSketchPhoto(mobileTrapId, index+1, foundIds, sketchPhotoSuccessCallback, sketchPhotoErrorCallback);
              }
            } else {
              sketchPhotoSuccessCallback();
            }
          }

          uploadSketchPhoto(mobileTrapId, 0, foundIds, function() {
            sketchPhotosSuccessCallback();
          }, function(organismId) {
            sketchPhotosErrorCallback('Error uploading sketch or photo for organism id' + organismId);
          });
        }

        uploadAllSketchPhotos(mobileTrapId, foundIds, function() {
          goToView(mobileTrapId);
        }, function(errorMessage) {
          delete mt.protocolMobileTrap._id;
          mt.error = errorMessage;
          return false;
        });
      }

      function errorCallback(res) {
        mt.error = res.data.message;
      }
    };

    mt.cancel = function() {
      $state.go('protocol-mobile-traps.main');
    };

    mt.addOrganism = function(organism) {
      var organismDetails = mt.getFoundOrganism(organism);
      organismDetails.count = organismDetails.count+1;
    };

    mt.removeOrganism = function(organism) {
      var organismDetails = mt.getFoundOrganism(organism);
      organismDetails.count = organismDetails.count-1;
    };

    mt.openOrganismDetails = function(organism) {
      var content = angular.element('#modal-organism-details-'+organism._id);

      mt.organismDetails = mt.getFoundOrganism(organism);
      mt.sketchPhotoUrl = (mt.organismDetails.imageUrl) ? mt.organismDetails.imageUrl : '';

      content.modal('show');
    };

    var saveImageOnBlur = function(organismId, successCallback, errorCallback) {
      if (mt.protocolMobileTrap._id) {
        if (organismId) {
          var uploader = mt.foundOrganisms[organismId].uploader;
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              uploader.removeFromQueue(fileItem);
              successCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
              errorCallback(response.message);
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-mobile-traps/' + mt.protocolMobileTrap._id + '/organisms/' + organismId + '/upload-sketch-photo';
            };
            uploader.uploadAll();
          } else {
            successCallback();
          }
        } else {
          errorCallback('Error with organism id');
        }
      }
    };

    mt.saveOrganismDetails = function(organismDetails, organismId, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.organismDetailsForm');
        return false;
      } else {
        angular.element('#modal-organism-details-'+organismId).modal('hide');
        mt.foundOrganisms[organismDetails.organism._id] = organismDetails;

        var imageErrorMessage = '';
        var foundIds = foundOrganismsToMobileOrganisms(imageErrorMessage);

        console.log('mobile trap', mt.protocolMobileTrap);

        mt.saveOnBlur(function() {
          saveImageOnBlur(organismId, function() {
            mt.organismDetails = {};
            mt.sketchPhotoUrl = '';
          }, function(errorMessage) {
            mt.error = errorMessage;
          });
        }, function(errorMessage) {
          mt.error = errorMessage;
        });
      }
    };

    mt.cancelOrganismDetails = function(organismId) {
      angular.element('#modal-organism-details-'+organismId).modal('hide');
      mt.organismDetails = {};
      mt.sketchPhotoUrl = '';
    };

    mt.saveOnBlur = function(successCallback, errorCallback) {
      if (mt.protocolMobileTrap._id) {
        $http.post('/api/protocol-mobile-traps/' + mt.protocolMobileTrap._id + '/incremental-save',
        mt.protocolMobileTrap)
        .success(function (data, status, headers, config) {
          mt.protocolMobileTrap = data;
          mt.protocolMobileTrap.collectionTime = moment(mt.protocolMobileTrap.collectionTime).toDate();
          console.log('mt.protocolMobileTrap', mt.protocolMobileTrap);
          setupMobileOrganisms();
          console.log('saved');
          successCallback();
        })
        .error(function (data, status, headers, config) {
          mt.error = data.message;
          errorCallback(data.message);
        });
      }
    };
  }
})();
