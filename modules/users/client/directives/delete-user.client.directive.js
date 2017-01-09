(function() {
  'use strict';

  angular
    .module('teams')
    .directive('deleteUserModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/delete-user.client.view.html',
        scope: {
          user: '=',
          deleteFunction: '=',
          cancelFunction: '=',
          canBeDeletedFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
