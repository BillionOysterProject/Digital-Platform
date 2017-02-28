(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formOrgProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/organization/form-org-profile.client.view.html',
        scope: {
          organization: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'SchoolOrganizationFormController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.form.orgProfileForm.$setPristine();
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
            scope.orgPhotoUrl = (scope.organization && scope.organization.photo && scope.organization.photo.path) ?
              scope.organization.photo.path : '';
          });
        }
      };
    });
})();
