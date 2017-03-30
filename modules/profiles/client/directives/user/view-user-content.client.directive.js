(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewUserContent', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/view-user-content.client.view.html',
        scope: {
          user: '=',
          team: '@?',
          teams: '@?',
          organization: '@?',
          openUserForm: '=',
          openUserDelete: '=',
          closeFunction: '='
        },
        controller: 'UserProfileController',
        link: function(scope, element, attrs) {

          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;
            if (scope.user) {
              scope.loaded = false;
              if (!scope.user.roles) {
                scope.loadUser(function() {
                  scope.loadUserData();
                });
              } else {
                if (!scope.loading) {
                  scope.loadUserData();
                }
              }
            }
          });
        }
      };
    });
})();
