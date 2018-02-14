(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('SchoolOrganizationFormController', SchoolOrganizationFormController);

  SchoolOrganizationFormController.$inject = ['$scope', '$http', 'FileUploader', 'SchoolOrganizationsService',
    'Authentication', 'ExpeditionViewHelper'];

  function SchoolOrganizationFormController($scope, $http, FileUploader, SchoolOrganizationsService,
    Authentication, ExpeditionViewHelper) {
    var checkRole = ExpeditionViewHelper.checkRole;
    $scope.isAdmin = checkRole('admin');
    $scope.isGuest = checkRole('guest');

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
      name: 'Non-profit / Community Organization',
      value: 'community organization'
    }, {
      name: 'College / University',
      value: 'college'
    }, {
      name: 'Government Agency',
      value: 'government'
    }, {
      name: 'Business',
      value: 'business'
    }, {
      name: 'Other',
      value: 'other'
    }];

    $scope.schoolTypes = [{
      name: 'NYC Charter School',
      value: 'nyc-charter',
    }, {
      name: 'Private School',
      value: 'private',
    }, {
      name: 'Other Public / Charter School',
      value: 'other-public',
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
        console.error(res);
      }
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
