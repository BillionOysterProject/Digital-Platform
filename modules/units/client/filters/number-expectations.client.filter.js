'use strict';

angular.module('units').filter('numberExpectations', function() {
  return function(input) {
    switch(input) {
      case 'kps21': return 'K-PS2-1 Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.';
      case 'kps22': return 'K-PS2-2 Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.';
      default: return input;
    }
  };
});