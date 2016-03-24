(function() {
  'use strict';

  angular
    .module('teams')
    .directive('approveTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/approve-team-members.client.view.html',
        scope: {
          acceptFunction: '=',
          rejectFunction: '=',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();