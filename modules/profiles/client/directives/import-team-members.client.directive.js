(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('importTeamMembersModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/import-team-members.client.view.html',
        scope: {
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        controller: 'TeamsImportController',
        replace: true,
        link: function(scope, element, attrs) {
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
          });
        }
      };
    });
})();
