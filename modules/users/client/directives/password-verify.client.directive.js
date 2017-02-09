'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel.$viewValue;
          }
          return combined;
        }, function(value) {
          if(value && scope.passwordVerify && ngModel) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return origin === password;
            };
          }
        });
      }
    };
  }]);
