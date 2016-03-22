(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .controller('ProtocolMobileTrapsController', ProtocolMobileTrapsController);

  ProtocolMobileTrapsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 
    'FileUploader', 'ProtocolMobileTrapsService', 'MobileOrganismsService'];

  function ProtocolMobileTrapsController($scope, $state, Authentication, $stateParams, 
    FileUploader, ProtocolMobileTrapsService, MobileOrganismsService) {
    var mt = this;

    // Set up Protocol Mobile Traps
    mt.protocolMobileTrap = {};
    if ($stateParams.protocolMobileTrapId) {
      ProtocolMobileTrapsService.get({
        mobileTrapId: $stateParams.protocolMobileTrapId
      }, function(data) {
        mt.protocolMobileTrap = data;
      });
    } else {
      mt.protocolMobileTrap = new ProtocolMobileTrapsService();
      mt.protocolMobileTrap.mobileOrganisms = [];
    }

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

    mt.findOrganisms = function() {
      MobileOrganismsService.query({
        category: mt.filter.category
      }, function(data) {
        mt.mobileOrganisms = data;
        console.log('organisms', mt.mobileOrganisms);
      });
    };

    mt.mobileOrganisms = mt.findOrganisms();

    mt.authentication = Authentication;
    mt.error = null;
    mt.form = {};

    mt.sketchPhotoUploaders = [];

    // Remove existing protocol mobile trap
    mt.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        mt.protocolMobileTrap.$remove($state.go('protocol-mobile-traps.main'));
      }
    };

    // Save protocol mobile trap
    mt.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'mt.form.protocolMobileTrapForm');
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

        function uploadAllSketchPhotos(mobileTrapId, sketchPhotosSuccessCallback, sketchPhotosErrorCallback) {
          function uploadSketchPhoto(mobileTrapId, index, sketchPhotoSuccessCallback, sketchPhotoErrorCallback) {
            if (index < mt.sketchPhotoUploaders.length && mt.sketchPhotoUploaders[index]) {
              var uploader = mt.sketchPhotoUploaders[index].uploader;
              var organismId = mt.sketchPhotoUploaders[index].organismId;
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadSketchPhoto(mobileTrapId, index+1, sketchPhotoSuccessCallback, sketchPhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, headers) {
                  mt.protocolMobileTrap.mobileOrganisms[index].sketchPhoto.error = response.message;
                  sketchPhotoErrorCallback(index);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-mobile-traps/' + mobileTrapId + '/organisms/' + organismId + '/upload-sketch-photo';
                };
                uploader.uploadAll();
              } else {
                uploadSketchPhoto(mobileTrapId, index+1, sketchPhotoSuccessCallback, sketchPhotoErrorCallback);
              }
            } else {
              sketchPhotoSuccessCallback();
            }
          }

          uploadSketchPhoto(mobileTrapId, 0, function() {
            sketchPhotosSuccessCallback();
          }, function(index) {
            sketchPhotosErrorCallback('Error uploading sketch or photo for organism #' + index);
          });
        }

        uploadAllSketchPhotos(mobileTrapId, function() {
          goToView(mobileTrapId);
        }, function(errorMessage) {
          mt.error = errorMessage;
        });
      }

      function errorCallback(res) {
        mt.error = res.data.message;
      }
    };

    mt.cancel = function() {
      $state.go('protocol-mobile-traps.main');
    };

  }
})();