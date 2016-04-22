(function() {
  'use strict';

  angular
    .module('teams')
    .directive('approveTeamLeadsModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/approve-team-leads.client.view.html',
        scope: {
          leadRequests: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'TeamLeadApprovalController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
