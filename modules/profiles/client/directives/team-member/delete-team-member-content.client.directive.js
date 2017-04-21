(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamMemberContent', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-member/delete-team-member-content.client.view.html',
        scope: {
          teamMember: '=',
          team: '=',
          closeFunction: '='
        },
        controller: 'TeamMemberDeleteController',
        link: function(scope, element, attrs) {
          scope.$on('deleteTeamMember', function() {
          });

          scope.$watch('teamMember', function(newValue, oldValue) {
            scope.teamMember = newValue;
          });
        }
      };
    });
})();
