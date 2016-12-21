(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamLeadDeleteController', TeamLeadDeleteController);

  TeamLeadDeleteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function TeamLeadDeleteController($scope, $http, TeamLeadBySchoolOrgsService) {
    $scope.error = [];

    $scope.teamLead = '';

    $scope.delete = function() {
      $http.post('api/users/leaders/' + $scope.teamLead._id + '/delete', {
        user: $scope.teamLead,
        role: 'team lead',
        team: $scope.team,
        organization: $scope.organization,
        teamOrOrg: 'team'
      })
      .success(function(data, status, headers, config) {
        $scope.teamLead = '';

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
