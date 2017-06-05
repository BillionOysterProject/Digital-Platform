(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/invite-team-lead.client.view.html',
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
            scope.error = null;
            scope.form.inviteTeamLead.$setPristine();
          });
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
            scope.existingTeamLead = '';
            scope.newTeamLead = {};
            scope.error = null;
            scope.form.inviteTeamLead.$setPristine();
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.existingTeamLead = '';
            scope.newTeamLead = {};
            scope.error = null;
            scope.form.inviteTeamLead.$setPristine();
            scope.findTeamLeads();
          });
        }
      };
    });
})();
