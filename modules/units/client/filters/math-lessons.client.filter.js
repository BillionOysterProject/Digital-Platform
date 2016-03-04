'use strict';

angular.module('units').filter('mathLessons', function() {
  return function(input) {
    switch(input) {
      case 'dataanalysis': return 'Data Analysis Lesson';
      case 'graphing': return 'Graphing Lesson';
      case 'ratiosproportions': return 'Ratios & Proportions Lesson';
      case 'algebra': return 'Algebra Lesson';
      default: return input;
    }
  };
});