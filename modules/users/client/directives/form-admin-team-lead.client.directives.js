(function() {
  'use strict';

  angular
    .module('users')
    .directive('formAdminTeamLeadModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/form-admin-team-lead.client.view.html',
        scope: {
          user: '=',
          organizations: '=',
          closeFunction: '='
        },
        controller: 'TeamLeadController',
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.findUserAndOrganization();
          });
        }
      };
    }]);
})();
