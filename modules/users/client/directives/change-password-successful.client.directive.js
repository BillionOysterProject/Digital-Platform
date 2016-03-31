(function() {
  'use strict';

  angular
    .module('users')
    .directive('changePasswordSuccessfulModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/settings/change-password-successful.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          
        }
      };
    });
})();