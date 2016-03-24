(function() {
  'use strict';

  angular
    .module('teams')
    .directive('deleteTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/delete-team-member.client.view.html',
        scope: {
          deleteFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();