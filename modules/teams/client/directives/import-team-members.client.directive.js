(function() {
  'use strict';

  angular
    .module('teams')
    .directive('importTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/import-team-members.client.view.html',
        scope: {
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
            
        }
      };
    });
})();