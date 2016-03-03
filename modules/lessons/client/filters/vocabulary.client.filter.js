'use strict';

angular.module('lessons').filter('vocabulary', function() {
  return function(input) {
    switch(input) {
      case 'art': return 'Art';
      case 'ecosystem': return 'Ecosystem';
      case 'hypothesis': return 'Hypothesis';
      case 'oyster': return 'Oyster';
      case 'science': return 'Science';
      default: return input;
    }
  };
});