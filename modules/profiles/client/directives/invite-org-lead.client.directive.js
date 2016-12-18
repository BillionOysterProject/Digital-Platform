(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteOrgLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/invite-org-lead.client.view.html',
        scope: {
          organization: '=?',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http, TeamLeadBySchoolOrgsService, Admin, SchoolOrganizationsService) {
          $scope.error = [];

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
            $http.post('api/users/invites', {
              user: user,
              teamOrOrg: 'organization',
              role: 'team lead pending' //change when new 'org lead pending' role exists
            })
            .success(function(data, status, headers, config) {
              $scope.existingTeamLead = '';
              $scope.newTeamLead = {};

              $scope.closeFunction();
            })
            .error(function(data, status, headers, config) {
              $scope.error = data;
            });
          };

          $scope.close = function() {
            $scope.closeFunction();
          };
        },
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.existingTeamLead = '';
            scope.newTeamLead = {};

            scope.form.inviteOrgLead.$setPristine();
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.findTeamLeads();
          });
        }
      };
    });
})();
