(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formAdminTeamLeadModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/form-admin-team-lead.client.view.html',
        scope: {
          user: '=',
          organizations: '=',
          teamLeadType: '=',
          saveFunction: '=',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
        }
      };
    }]);
})();
