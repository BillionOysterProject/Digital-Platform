'use strict';

angular.module('lessons').filter('ngssStandards', function() {
  return function(input) {
    switch(input) {
      case 'ps1a': return 'PS1A Structure and Properties of matter';
      case 'ps1b': return 'PS1B Chemical Reactions';
      case 'ps1c': return 'PS1C Nuclear Processes';
      case 'ess1a': return 'ESS1A The Universe and Its Stars';
      case 'ess1b': return 'ESS1B Earth and the Solar System';
      case 'ess1c': return 'ESS1C The History of Planet Earth ESS2 Earth\'s';
      case 'ess2a': return 'ESS2A Earth Materials and Systems';
      case 'ess2b': return 'ESS2B Plate Tectonics and Large-Scale System Interactions';
      case 'ess2c': return 'ESS2C The Roles of Water in Earth\'s Surface Processes';
      case 'g8unit': return 'Grade 8, Unit1: Humans and the Environment';
      default: return input;
    }
  };
});