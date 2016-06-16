(function () {
  'use strict';

  angular
    .module('users')
    .controller('FormAdminTeamLeadController', FormAdminTeamLeadController);

  FormAdminTeamLeadController.$inject = ['$scope', '$http'];

  function FormAdminTeamLeadController($scope, $http) {
    $scope.teamLeadType = [
      { label: 'Teacher', value: 'teacher' },
      { label: 'Citizen Scientist', value: 'citizen scientist' },
      { label: 'Professional Scientist', value: 'professional scientist' },
      { label: 'Site Coordinator', value: 'site coordinator' },
      { label: 'Other', value: 'other' }
    ];

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.adminTeamLeadForm');
        return false;
      }

      if ($scope.user._id) {
        $scope.user.$update(successCallback, errorCallback);
      } else {
        $scope.user.$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        $scope.saveFunction();
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    };
  }
})();
