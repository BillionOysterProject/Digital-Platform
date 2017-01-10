(function() {
  'use strict';

  angular
    .module('teams')
    .directive('removeTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/delete-team-member.client.view.html',
        scope: {
          user: '=',
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
