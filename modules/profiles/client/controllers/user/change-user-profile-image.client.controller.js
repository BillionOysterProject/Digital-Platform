(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileImageController', UserProfileImageController);

  UserProfileImageController.$inject = ['$scope', '$http', 'FileUploader', 'Authentication', 'Users'];

  function UserProfileImageController($scope, $http, FileUploader, Authentication, Users) {
    $scope.user = Authentication.user;

    $scope.userPhotoUrl = ($scope.user && $scope.user.profileImageURL) ? $scope.user.profileImageURL : '';

    $scope.userPhotoUploader = new FileUploader({
      alias: 'newProfilePicture'
    });
    $scope.error = [];

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.userProfileImageForm');
      }

      $scope.user.profileImageURL = $scope.userPhotoUrl;

      function uploadUserPhoto(userId, imageSuccessCallback, imageErrorCallback) {
        if ($scope.userPhotoUploader.queue.length > 0) {
          $scope.userPhotoUploader.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.userPhotoUploader.removeFromQueue(fileItem);
            imageSuccessCallback(response);
          };

          $scope.userPhotoUploader.onErrorItem = function(fileItem, response, status, headers) {
            imageErrorCallback(response.message);
          };

          $scope.userPhotoUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/users/picture';
          };
          $scope.userPhotoUploader.uploadAll();
        } else {
          imageSuccessCallback();
        }
      }

      uploadUserPhoto($scope.user._id, function(response) {
        Authentication.user = response;
        $scope.closeFunction(true);
      }, function(errorMessage) {
        $scope.error = errorMessage;
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
