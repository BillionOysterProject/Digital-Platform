'use strict';

angular.module('lessons').filter('subjectAreas', function() {
  return function(input) {
    switch(input) {
      case 'ecology': return 'Ecology';
      case 'geologyeatchscience': return 'Geology and Earth Science';
      case 'limnology': return 'Limnology';
      case 'marinebio': return 'Marine Biology';
      case 'oceanography': return 'Oceanography';
      case 'computerscience': return 'Computer Science';
      case 'engineering': return 'Engineering';
      case 'dataanalysis': return 'Data Analysis';
      case 'graphing': return 'Graphing';
      case 'ratiosproportions': return 'Ratios & Proportions';
      case 'algebra': return 'Algebra';
      case 'history': return 'History';
      case 'economics': return 'Economics';
      case 'englishlanguagearts': return 'English Language Arts';
      case 'music': return 'Music';
      case 'art': return 'Art';
      default: return input;
    }
  };
});