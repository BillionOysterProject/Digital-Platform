(function() {
  'use strict';

  angular
    .module('teams')
    .directive('deleteAdminTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/delete-admin-team-lead.client.view.html',
        scope: {
          user: '=',
          deleteFunction: '=',
          cancelFunction: '=',
          canBeDeletedFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
