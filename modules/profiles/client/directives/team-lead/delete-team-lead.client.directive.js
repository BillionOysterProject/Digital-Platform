(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/delete-team-lead.client.view.html',
        scope: {
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamLeadDeleteController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.teamLead = '';
            scope.error = null;
            scope.form.deleteTeamLead.$setPristine();
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
