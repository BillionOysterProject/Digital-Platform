(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('approveTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-member/approve-team-members.client.view.html',
        scope: {
          teamRequests: '=',
          teams: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamApprovalController',
        link: function(scope, element, attrs) {
        }
      };
    });
})();
