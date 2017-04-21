(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamLeadInviteController', TeamLeadInviteController);

  TeamLeadInviteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function TeamLeadInviteController($scope, $http, TeamLeadBySchoolOrgsService) {
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
      $scope.error = null;
      
      //it's too easy for the user to just type in a string (or for chrome to autofill a string and hide the typeahead list with its own saved usernames)
      if($scope.existingTeamLead && !$scope.existingTeamLead._id) {
        $scope.error = 'Please make sure you select an existing team lead from the list that appears as you begin to type their name.';
        return;
      }

      var user = ($scope.existingTeamLead) ? $scope.existingTeamLead : $scope.newTeamLead;
      $http.post('api/users/leaders', {
        user: user,
        organization: $scope.organization,
        team: $scope.team,
        teamOrOrg: 'team',
        role: 'team lead pending'
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
