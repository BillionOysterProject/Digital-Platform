(function() {
  'use strict';

  angular
    .module('teams')
    .directive('formTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/form-team.client.view.html',
        scope: {
          teamMember: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();