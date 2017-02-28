(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteUserModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/delete-user.client.view.html',
        scope: {
          user: '=',
          deleteFunction: '=',
          closeFunction: '=',
          canBeDeletedFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
