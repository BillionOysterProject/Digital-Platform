'use strict';

angular.module('users').filter('teamLeadTypes', function() {
  return function(input) {
    switch(input) {
      case 'teacher': return 'Teacher';
      case 'citizen scientist': return 'Citizen Scientist';
      case 'professional scientist': return 'Professional Scientist';
      case 'site coordinator': return 'Site Coordinator';
      case 'other': return 'Other';
      default: return input;
    }
  };
});
