(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team/delete-team.client.view.html',
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
