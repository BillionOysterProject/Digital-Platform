(function() {
  'use strict';

  angular
    .module('teams')
    .directive('deleteTeamModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/delete-team.client.view.html',
        scope: {
          team: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamDeleteController',
        link: function(scope, element, attrs) {
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
          });
        }
      };
    });
})();
