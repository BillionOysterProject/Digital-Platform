(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserFormController', UserFormController);

  UserFormController.$inject = ['$scope', '$http', 'Authentication', 'Users'];

  function UserFormController($scope, $http, Authentication, Users) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        Authentication.user = response;
        $scope.closeFunction(true);
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
