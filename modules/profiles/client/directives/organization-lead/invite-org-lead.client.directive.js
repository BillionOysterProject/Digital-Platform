(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteOrgLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/organization-lead/invite-org-lead.client.view.html',
        scope: {
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'OrganizationLeadInviteController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.existingTeamLead = '';
            scope.newTeamLead = {};
            scope.error = null;
            scope.form.inviteOrgLead.$setPristine();
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.existingTeamLead = '';
            scope.newTeamLead = {};
            scope.error = null;
            scope.form.inviteOrgLead.$setPristine();
            scope.findTeamLeads();
          });
        }
      };
    });
})();
