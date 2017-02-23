(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationLeadInviteController', OrganizationLeadInviteController);

  OrganizationLeadInviteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function OrganizationLeadInviteController($scope, $http, TeamLeadBySchoolOrgsService) {
    $scope.error = null;

    $scope.existingTeamLead = '';
    $scope.newTeamLead = {};

    $scope.findTeamLeads = function() {
      if ($scope.organization && $scope.organization._id) {
        TeamLeadBySchoolOrgsService.query({
          schoolOrgId: $scope.organization._id
        }, function(data) {
          $scope.teamLeads = data;
        });
      }
    };
    $scope.findTeamLeads();

    $scope.send = function() {
      var user = ($scope.existingTeamLead) ? $scope.existingTeamLead : $scope.newTeamLead;
      $http.post('api/users/leaders', {
        user: user,
        organization: $scope.organization,
        teamOrOrg: 'organization',
        role: (user._id !== null && user._id !== undefined) ? 'org lead' : 'org lead pending'
      })
      .success(function(data, status, headers, config) {
        $scope.existingTeamLead = '';
        $scope.newTeamLead = {};
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
