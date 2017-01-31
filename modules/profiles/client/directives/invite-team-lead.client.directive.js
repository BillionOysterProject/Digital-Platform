(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/invite-team-lead.client.view.html',
        scope: {
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamLeadInviteController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.existingTeamLead = '';
            scope.newTeamLead = {};

            scope.form.inviteTeamLead.$setPristine();
          });
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.findTeamLeads();
          });
        }
      };
    });
})();
