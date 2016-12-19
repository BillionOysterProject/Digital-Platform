(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationLeadDeleteController', OrganizationLeadDeleteController);

  OrganizationLeadDeleteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function OrganizationLeadDeleteController($scope, $http, TeamLeadBySchoolOrgsService) {
    $scope.error = [];

    $scope.orgLead = '';

    $scope.delete = function() {
      $http.post('api/users/leaders/' + $scope.orgLead._id + '/delete', {
        user: $scope.orgLead,
        organization: $scope.organization,
        teamOrOrg: 'organization'
      })
      .success(function(data, status, headers, config) {
        $scope.orgLead = '';

        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data;
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
