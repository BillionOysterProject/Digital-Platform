(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/delete-team-member.client.view.html',
        scope: {
          teamMember: '=',
          team: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamMemberDeleteController',
        link: function(scope, element, attrs) {
          scope.$watch('teamMember', function(newValue, oldValue) {
            scope.teamMember = newValue;
          });
        }
      };
    });
})();
