'use strict';

angular.module('units').filter('scienceLessons', function() {
  return function(input) {
    switch(input) {
      case 'ecology': return 'Ecology Lesson';
      case 'geologyeatchscience': return 'Geology and Earth Science Lesson';
      case 'limnology': return 'Limnology Lesson';
      case 'marinebio': return 'Marine Biology Lesson';
      case 'oceanography': return 'Oceanography Lesson';
      default: return input;
    }
  };
});