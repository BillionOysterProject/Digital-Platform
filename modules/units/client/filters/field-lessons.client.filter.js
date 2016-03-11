'use strict';

angular.module('units').filter('fieldLessons', function() {
  return function(input) {
    switch(input) {
      case 'field1': return 'Field Lesson 1';
      case 'field2': return 'Field Lesson 2';
      default: return input;
    }
  };
});