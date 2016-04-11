'use strict';

angular.module('protocol-water-quality').filter('testToolMethods', function() {
  return function(input) {
    switch(input) {
      case 'digitalThermometer': return 'Digital thermometer';
      case 'analogThermometer': return 'Analog thermometer';
      case 'sensor': return 'Sensor';
      case 'sensorRO': return 'Sensor (read only)';
      case 'colormetricvAmpules': return 'Colormetric ampules';
      case 'winkler': return 'Winkler';
      case 'hydrometer': return 'Hydrometer';
      case 'refractometer': return 'Refractometer';
      case 'testStrips': return 'Test strips';
      case 'turbidityTube': return 'Turbidity tube';
      case 'photometer': return 'Photometer';
      default: return input;
    }
  };
});
