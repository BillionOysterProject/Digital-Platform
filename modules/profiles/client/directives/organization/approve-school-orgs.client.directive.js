(function() {
  'use strict';

  angular
    .module('school-orgs')
    .directive('approveSchoolOrgModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/organization/approve-school-orgs.client.view.html',
        scope: {
          orgRequests: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'SchoolOrganizationsApprovalController',
        link: function(scope, element, attrs) {
          scope.$watch('orgRequests', function(newValue, oldValue) {
            scope.orgRequests = newValue;
          });
        }
      };
    });
})();
