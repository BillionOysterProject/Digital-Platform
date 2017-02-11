(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('approveTeamLeadsModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/approve-team-leads.client.view.html',
        scope: {
          leadRequests: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'TeamLeadApprovalController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
