(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteOrgLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/delete-org-lead.client.view.html',
        scope: {
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'OrganizationLeadDeleteController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.orgLead = '';

            scope.form.deleteOrgLead.$setPristine();
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
          });
        }
      };
    });
})();
