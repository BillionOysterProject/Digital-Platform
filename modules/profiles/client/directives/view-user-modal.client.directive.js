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
          teams: '=',
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'UserProfileController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            console.log('show.bs.modal');
            scope.roles = scope.findUserRoles();
            console.log('roles', scope.roles);
            scope.isAdmin = scope.checkRole('admin');
            console.log('isAdmin', scope.isAdmin);
            scope.isTeamLead = scope.checkRole('team lead') || scope.checkRole('team lead pending');
            console.log('isTeamLead', scope.isTeamLead);
            scope.isUserPending = scope.checkUserPending();
            console.log('isUserPending', scope.isUserPending);
            scope.findExpeditions();
            console.log('findExpeditions', scope.expeditions);
          });
        }
      };
    });
})();
