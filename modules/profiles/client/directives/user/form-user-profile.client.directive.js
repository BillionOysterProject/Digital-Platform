(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formUserProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/form-user-profile.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        controller: 'UserFormController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
