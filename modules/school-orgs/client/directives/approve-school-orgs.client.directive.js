(function() {
  'use strict';

  angular
    .module('school-orgs')
    .directive('approveSchoolOrgModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/school-orgs/client/views/approve-school-orgs.client.view.html',
        scope: {
          orgRequests: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'SchoolOrganizationsApprovalController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
