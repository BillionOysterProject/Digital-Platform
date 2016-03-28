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
          deleteFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();