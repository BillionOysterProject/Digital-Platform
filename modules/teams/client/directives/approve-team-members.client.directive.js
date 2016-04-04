(function() {
  'use strict';

  angular
    .module('teams')
    .directive('approveTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/approve-team-members.client.view.html',
        scope: {
          teamRequests: '=',
          teams: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'TeamApprovalController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
