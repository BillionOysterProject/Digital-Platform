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
          team: '=?',
          teams: '=?',
          organization: '=?',
          openUserForm: '=',
          openUserDelete: '=',
          closeFunction: '='
        },
        controller: 'UserProfileController',
        link: function(scope, element, attrs) {
          scope.$on('userView', function() {
            scope.isCurrentUserAdmin = false;
            scope.isCurrentUserTeamLead = false;
            scope.isCurrentUserUser = false;
            if (scope.user && scope.user._id && !scope.loading) {
              scope.loaded = false;
              scope.loading = true;
              scope.loadUser();
            }
          });

          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;
            if (scope.user && scope.user._id && !scope.loading) {
              scope.loaded = false;
              scope.loading = true;
              scope.loadUser();
            }
          });
        }
      };
    });
})();
