(function() {
  'use strict';

  angular
    .module('school-orgs')
    .directive('deleteSchoolOrgModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/school-orgs/client/views/delete-school-org.client.view.html',
        scope: {
          schoolOrg: '=',
          deleteFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
