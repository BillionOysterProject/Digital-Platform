(function() {
  'use strict';

  angular
    .module('teams')
    .directive('deleteTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/delete-team-member.client.view.html',
        scope: {
          teamMember: '=',
          closeFunction: '='
        },
        controller: 'TeamMemberController',
        replace: true,
        link: function(scope, element, attrs) {
          scope.$watch('teamMember', function(newValue, oldValue) {
            scope.teamMember = newValue;
          });
        }
      };
    });
})();
