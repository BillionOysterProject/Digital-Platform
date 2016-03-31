'use strict';

angular.module('protocol-water-quality').filter('testUnits', function() {
  return function(input) {
    switch(input) {
      case 'f': return 'F';
      case 'c': return 'C';
      case 'mgl': return 'mg/L (PPM)';
      case 'saturation': return '% saturation';
      case 'ppt': return 'PPT';
      case 'pHlogscale': return 'pH (logscale)';
      case 'ntu': return 'NTU**';
      case 'ppm': return 'PPM';
      default: return input;
    }
  };
});
