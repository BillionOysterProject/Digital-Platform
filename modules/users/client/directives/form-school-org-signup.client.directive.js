(function() {
  'use strict';

  angular
    .module('users')
    .directive('formSchoolOrgSignupModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/school-orgs/client/views/form-school-org.client.view.html',
        scope: {
          schoolOrg: '=',
          saveFunction: '&',
          cancelFunction: '&'
        },
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.schoolOrgForm.$setSubmitted(false);
            scope.form.schoolOrgForm.$setPristine();
          });

          scope.save = function(isValid) {
            if (!isValid) {
              scope.$broadcast('show-errors-check-validity', 'form.schoolOrgForm');
              return false;
            }

            scope.saveFunction(scope.schoolOrg);
          };
        }
      };
    }]);
})();
