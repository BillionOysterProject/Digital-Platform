(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewUserModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/view-user.client.view.html',
        scope: {
          user: '=',
          teams: '=?',
          organization: '=?',
          closeFunction: '='
        },
        replace: true,
        controller: 'UserProfileController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.$watch('user', function(newValue, oldValue) {
              scope.user = newValue;
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
            });
          });
        }
      };
    });
})();
