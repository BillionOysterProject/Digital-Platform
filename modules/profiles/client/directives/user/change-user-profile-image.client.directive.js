(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('changeUserProfileImageModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/change-user-profile-image.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        controller: 'UserProfileImageController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
