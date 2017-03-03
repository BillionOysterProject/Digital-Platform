(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewUserModal', function($state) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/view-user.client.view.html',
        scope: {
          user: '=',
          team: '=?',
          teams: '=?',
          organization: '=?',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          var toGoState = null;
          var toGoParams = null;

          //state change doesn't give the modal time to properly close so
          //the modal background would remain after state change.
          //here, if the modal is showing, prevent state change until the modal is closed
          scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if(element.hasClass('in')) {
              event.preventDefault();
              toGoState = toState;
              toGoParams = toParams;
              element.modal('hide');
            }
          });

          //when modal is hidden, if we were supposed to change state then do it
          element.bind('hidden.bs.modal', function() {
            if(toGoState) {
              $state.go(toGoState.name, toGoParams);
            }
          });

          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;
            scope.isCurrentUserAdmin = scope.checkRole('admin');

            scope.isAdmin = scope.checkViewedUserRole('admin');
            scope.isTeamLead = scope.checkViewedUserRole('team lead') ||
              scope.checkViewedUserRole('team lead pending');
            scope.findOrganization();
          });
        },
        controller: ['$scope', 'lodash', 'ExpeditionViewHelper', 'SchoolOrganizationsService',
        function ($scope, lodash, ExpeditionViewHelper, SchoolOrganizationsService) {
          $scope.content = 'userView';
          $scope.checkRole = ExpeditionViewHelper.checkRole;

          $scope.checkViewedUserRole = function(role) {
            var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
              return o === role;
            });
            return (roleIndex > -1) ? true : false;
          };

          $scope.findOrganization = function() {
            if ($scope.user.schoolOrg) {
              if ($scope.user.schoolOrg._id) {
                $scope.organization = $scope.user.schoolOrg;
              } else {
                SchoolOrganizationsService.get({
                  schoolOrgId: $scope.user.schoolOrg
                }, function(data) {
                  $scope.organization = data;
                });
              }
            }
          };

          $scope.openAdminTeamLeadForm = function() {
            $scope.content = 'formTeamLead';
          };

          $scope.closeAdminTeamLeadForm = function() {
            $scope.content = 'userView';
          };

          $scope.openDeleteAdminTeamLead = function() {
            $scope.content = 'deleteTeamLead';
          };

          $scope.closeDeleteAdminTeamLead = function() {
            $scope.content = 'userView';
          };

          $scope.openFormTeamMember = function() {
            $scope.content = 'formTeamMember';
          };

          $scope.closeFormTeamMember = function() {
            $scope.content = 'userView';
          };

          $scope.openDeleteTeamMember = function(teamMember) {
            $scope.content = 'deleteTeamMember';
          };

          $scope.closeDeleteTeamMember = function() {
            $scope.content = 'userView';
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
