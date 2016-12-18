(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formOrgProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/form-org-profile.client.view.html',
        scope: {
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, FileUploader, SchoolOrganizationsService) {
          $scope.orgPhotoUrl = ($scope.organization && $scope.organization.photo && $scope.organization.photo.path) ?
            $scope.organization.photo.path : '';

          $scope.orgPhotoUploader = new FileUploader({
            alias: 'orgPhoto'
          });
          $scope.error = [];

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
                    item.url = 'api/school-org/' + orgId + '/upload-image';
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
                  $scope.closeFunction();
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
        },
        link: function(scope, element, attrs) {
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.orgPhotoUrl = (scope.organization && scope.organization.photo && scope.organization.photo.path) ?
              scope.organization.photo.path : '';
          });
        }
      };
    });
})();
