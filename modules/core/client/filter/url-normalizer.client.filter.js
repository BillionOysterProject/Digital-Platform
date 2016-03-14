'use strict';

angular.module('core').filter('urlNormalizer', function() {
  return function(input) {
    if (input && input.match(/http:\/\//i) === null && input.match(/https:\/\//i) === null) {
      return 'http://' + input;
    } else {
      return input;
    }
  };
});