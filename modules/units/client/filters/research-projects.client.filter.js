'use strict';

angular.module('units').filter('researchProjects', function() {
  return function(input) {
    switch(input) {
      case 'project1': return 'Project 1';
      case 'project2': return 'Project 2';
      default: return input;
    }
  };
});