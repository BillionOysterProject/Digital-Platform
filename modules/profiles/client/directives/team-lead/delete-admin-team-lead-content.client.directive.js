(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamLeadContent', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/delete-admin-team-lead-content.client.view.html',
        scope: {
          teamLead: '=',
          team: '=',
          closeFunction: '='
        },
        controller: 'TeamLeadDeleteController',
        link: function(scope, element, attrs) {
          scope.$on('deleteTeamLead', function() {
            scope.error = null;
          });
          scope.$watch('teamLead', function(newValue, oldValue) {
            scope.teamLead = newValue;
          });
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
