(function() {
  'use strict';

  angular
    .module('teams')
    .directive('importTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/import-team-members.client.view.html',
        scope: {
          teams: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        controller: 'TeamsImportController',
        replace: true,
        link: function(scope, element, attrs) {
            
        }
      };
    });
})();