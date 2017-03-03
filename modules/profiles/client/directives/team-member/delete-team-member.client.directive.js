(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-member/delete-team-member.client.view.html',
        scope: {
          teamMember: '=',
          team: '=',
          closeFunction: '='
        },
        replace: true
      };
    });
})();
