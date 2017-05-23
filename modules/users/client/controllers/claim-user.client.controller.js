'use strict';

angular.module('users').controller('ClaimUserController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    $scope.username = $location.search().username;
    $scope.usernameProvided = ($location.search().username) ? true : false;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Claim User
    $scope.claimUser = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/claim-user/' + $stateParams.token, {
        passwordDetails: $scope.passwordDetails,
        username: $scope.username
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        $scope.username = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
