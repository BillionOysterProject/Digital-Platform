(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewUserContent', function($state) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/view-user-content.client.view.html',
        scope: {
          user: '=',
          team: '=?',
          teams: '=?',
          organization: '=?',
          openUserForm: '=',
          openUserDelete: '=',
          closeFunction: '='
        },
        controller: 'UserProfileController',
        link: function(scope, element, attrs) {

          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;
            if (scope.user && scope.user.schoolOrg) {
              scope.roles = scope.findUserRoles();
              scope.isCurrentUserAdmin = scope.checkRole('admin');

              scope.isAdmin = scope.checkViewedUserRole('admin');
              scope.isTeamLead = scope.checkViewedUserRole('team lead') || scope.checkViewedUserRole('team lead pending');
              scope.isUserPending = scope.checkUserPending();
              scope.isUserTeamMember = scope.checkViewedUserRole('team member');
              scope.isUserTeamLead = scope.checkViewedUserRole('team lead');
              scope.findExpeditions();
              scope.findOrganization();
              scope.findTeams();
              scope.findRestorationStations();
              scope.findEvents();
              scope.findLessonsTaught();
            } else if (scope.user && !scope.user.schoolOrg) {
              scope.loadUser();
            }
          });
        }
      };
    });
})();
