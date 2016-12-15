(function () {
  'use strict';

  angular
    .module('users')
    .controller('TeamLeadController', TeamLeadController);

  TeamLeadController.$inject = ['$scope', '$http', 'Admin', 'SchoolOrganizationsService'];

  function TeamLeadController($scope, $http, Admin, SchoolOrganizationsService) {
    $scope.teamLeadType = [
      { label: 'Teacher', value: 'teacher' },
      { label: 'Citizen Scientist', value: 'citizen scientist' },
      { label: 'Professional Scientist', value: 'professional scientist' },
      { label: 'Site Coordinator', value: 'site coordinator' },
      { label: 'Other', value: 'other' }
    ];

    $scope.organizations = SchoolOrganizationsService.query();

    $scope.findUserAndOrganization = function() {
      $scope.organization = $scope.user.schoolOrg;
      $scope.user = ($scope.user) ? new Admin($scope.user) : new Admin();
      $scope.user.schoolOrg = ($scope.organization && $scope.organization._id) ?
        $scope.organization._id : $scope.organization;
    };

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
        $scope.closeFunction();
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    };

    $scope.remove = function() {
      $scope.user.$remove(function() {
        $scope.closeFunction();
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
