(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationLeadDeleteController', OrganizationLeadDeleteController);

  OrganizationLeadDeleteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function OrganizationLeadDeleteController($scope, $http, TeamLeadBySchoolOrgsService) {
    $scope.error = null;

    $scope.orgLead = '';

    $scope.delete = function() {
      $http.delete('api/users/leaders/' + $scope.orgLead._id + '/organization/' + $scope.organization._id,
      {})
      .success(function(data, status, headers, config) {
        $scope.orgLead = '';
        $scope.error = null;
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
