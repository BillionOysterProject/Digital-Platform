'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        //var result = owaspPasswordStrengthTest.test(password);
        var result = {
          errors: []
        };
        if (password.length < 6) {
          result.errors.push('Password must be 6 characters.');
        }
        return result;
      },
      getPopoverMsg: function () {
        //var popoverMsg = 'Please enter a passphrase or password with 10 or more characters, numbers, lowercase, uppercase, and special characters.';
        var popoverMsg = 'Password must be 6 characters.';
        return popoverMsg;
      }
    };
  }
]);
