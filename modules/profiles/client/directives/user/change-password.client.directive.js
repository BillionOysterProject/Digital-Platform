(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('changePasswordModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/change-password.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        controller: 'ChangePasswordController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.passwordForm.$setPristine();
          });
        }
      };
    });
})();
