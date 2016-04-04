(function() {
  'use strict';

  angular
    .module('users')
    .directive('changePasswordModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        controller: 'ChangePasswordController',
        link: function(scope, element, attrs) {
          console.log('passwordDetails', scope.passwordDetails);
          console.log('cancelFunction', scope.cancelFunction);
          element.bind('show.bs.modal', function () {
            scope.passwordForm.$setPristine();
          });
        }
      };
    });
})();