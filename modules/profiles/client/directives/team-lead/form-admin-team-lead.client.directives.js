(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formAdminTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/form-admin-team-lead.client.view.html',
        scope: {
          user: '=',
          organizations: '=',
          teamLeadType: '=',
          saveFunction: '=',
          closeFunction: '='
        },
        replace: true
      };
    });
})();
