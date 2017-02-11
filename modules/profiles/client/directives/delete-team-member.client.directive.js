(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('removeTeamMemberModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/delete-team-member.client.view.html',
        scope: {
          user: '=',
          team: '=',
          deleteFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'TeamMemberDeleteController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
