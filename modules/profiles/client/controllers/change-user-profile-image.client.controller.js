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

      $http.post('api/users/picture', $scope.user)
      .success(function(data, status, headers, config) {
        $scope.$broadcast('show-errors-reset', 'form.userProfileImageForm');

        $scope.success = true;
        Authentication.user = data;
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
