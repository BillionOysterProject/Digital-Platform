(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('SchoolOrganizationFormController', SchoolOrganizationFormController);

  SchoolOrganizationFormController.$inject = ['$scope', '$http', 'FileUploader', 'SchoolOrganizationsService'];

  function SchoolOrganizationFormController($scope, $http, FileUploader, SchoolOrganizationsService) {
    $scope.orgPhotoUrl = ($scope.organization && $scope.organization.photo && $scope.organization.photo.path) ?
      $scope.organization.photo.path : '';

    $scope.orgPhotoUploader = new FileUploader({
      alias: 'orgPhoto'
    });
    $scope.error = [];

    $scope.types = [{
      name: 'School',
      value: 'school'
    }, {
      name: 'Business',
      value: 'business'
    }, {
      name: 'Government',
      value: 'government'
    }, {
      name: 'Property owner',
      value: 'property owner'
    }, {
      name: 'Community organization',
      value: 'community organization'
    }, {
      name: 'Other',
      value: 'other'
    }];

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.orgProfileForm');
      }

      if ($scope.organization.photo) {
        if ($scope.orgPhotoUrl) {
          $scope.organization.photo.path = $scope.orgPhotoUrl;
        } else {
          $scope.organization.photo = null;
        }
      }

      if ($scope.organization._id) {
        $scope.organization.$update(successCallback, errorCallback);
      } else {
        //TODO: $save doesn't exist if the user is an admin and has no org
        $scope.organization.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var orgId = res._id;

        function uploadOrgPhoto(orgId, imageSuccessCallback, imageErrorCallback) {
          if ($scope.orgPhotoUploader.queue.length > 0) {
            $scope.orgPhotoUploader.onSuccessItem = function(fileItem, response, status, headers) {
              $scope.orgPhotoUploader.removeFromQueue(fileItem);
              imageSuccessCallback();
            };

            $scope.orgPhotoUploader.onErrorItem = function(fileItem, response, status, headers) {
              imageErrorCallback(response.message);
            };

            $scope.orgPhotoUploader.onBeforeUploadItem = function(item) {
              item.url = 'api/school-orgs/' + orgId + '/upload-image';
            };
            $scope.orgPhotoUploader.uploadAll();
          } else {
            imageSuccessCallback();
          }
        }

        uploadOrgPhoto(orgId, function() {
          SchoolOrganizationsService.get({
            schoolOrgId: orgId,
            full: true
          }, function(data) {
            $scope.closeFunction(data);
          });
        }, function(errorMessage) {
          $scope.error = errorMessage;
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
