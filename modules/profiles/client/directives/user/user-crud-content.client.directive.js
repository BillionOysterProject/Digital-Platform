(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('userCrudContent', function($state) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/user-crud-content.client.view.html',
        scope: {
          user: '=',
          team: '=?',
          teams: '=?',
          organization: '=?',
          initial: '=?',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;

            scope.isAdmin = scope.checkViewedUserRole('admin');
            scope.isTeamLead = scope.checkViewedUserRole('team lead') ||
              scope.checkViewedUserRole('team lead pending');
          });

          scope.$on('userCrudShown', function(event, data) {
            scope.content = scope.initial = data.view || 'userView';
            scope.$broadcast(scope.content);

            scope.isCurrentUserAdmin = scope.checkRole('admin');
            scope.isCurrentUserTeamLead = scope.checkRole('team lead');

            scope.isAdmin = scope.checkViewedUserRole('admin');
            scope.isTeamLead = scope.checkViewedUserRole('team lead') ||
              scope.checkViewedUserRole('team lead pending');
            // scope.findOrganization();
            // scope.findTeams();
          });
        },
        controller: ['$scope', 'lodash', 'ExpeditionViewHelper', 'SchoolOrganizationsService', 'TeamsService',
          function ($scope, lodash, ExpeditionViewHelper, SchoolOrganizationsService, TeamsService) {
            $scope.checkRole = ExpeditionViewHelper.checkRole;

            $scope.checkViewedUserRole = function(role) {
              if ($scope.user) {
                var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
                  return o === role;
                });
                return (roleIndex > -1) ? true : false;
              } else {
                return false;
              }
            };

            $scope.openAdminTeamLeadForm = function() {
              $scope.content = 'formTeamLead';
            };

            $scope.closeAdminTeamLeadForm = function(refresh) {
              if ($scope.initial === 'formTeamLead') {
                $scope.closeFunction(refresh);
              } else {
                $scope.content = 'userView';
              }
            };

            $scope.openDeleteAdminTeamLead = function() {
              $scope.content = 'deleteTeamLead';
            };

            $scope.closeDeleteAdminTeamLead = function(refresh) {
              if ($scope.initial === 'deleteTeamLead') {
                $scope.closeFunction(refresh);
              } else {
                $scope.content = 'userView';
              }
            };

            $scope.openFormTeamMember = function() {
              $scope.content = 'formTeamMember';
              $scope.$broadcast('formTeamMember');
            };

            $scope.closeFormTeamMember = function(refresh) {
              if ($scope.initial === 'formTeamMember') {
                $scope.closeFunction(refresh);
              } else {
                $scope.content = 'userView';
              }
            };

            $scope.openDeleteTeamMember = function(teamMember) {
              $scope.content = 'deleteTeamMember';
            };

            $scope.closeDeleteTeamMember = function(refresh) {
              if (refresh || $scope.initial === 'deleteTeamMember') {
                $scope.closeFunction(refresh);
              } else {
                $scope.content = 'userView';
              }
            };

            $scope.openUserForm = function() {
              if ($scope.isAdmin || $scope.isTeamLead) {
                $scope.openAdminTeamLeadForm();
              } else {
                $scope.openFormTeamMember();
              }
            };

            $scope.openUserDelete = function() {
              if ($scope.isAdmin) {
                $scope.openDeleteAdminTeamLead();
              } else {
                $scope.openDeleteTeamMember();
              }
            };
          }],
      };
    });
})();
