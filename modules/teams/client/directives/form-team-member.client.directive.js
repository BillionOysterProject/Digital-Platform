(function() {
  'use strict';

  angular
    .module('teams')
    .directive('formTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/form-team-member.client.view.html',
        scope: {
          teamMember: '=',
          teams: '=',
          newTeamName: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();