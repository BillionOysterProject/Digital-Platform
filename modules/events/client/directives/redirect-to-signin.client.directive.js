(function() {
  'use strict';

  angular
    .module('events')
    .directive('redirectToSigninModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/redirect-to-signin.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
        },
        controller: function($scope, $http, $location) {
          $scope.signIn = function() {
            $scope.closeFunction('/authentication/signin');
          };

          $scope.signUp = function() {
            $scope.closeFunction('/authentication/signup');
          };
        }
      };
    });
})();
