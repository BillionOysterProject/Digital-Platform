'use strict';

angular.module('lessons').filter('protocolConnections', function() {
  return function(input) {
    switch(input) {
      case 'protocol1': return 'Protocol 1: Site Conditions';
      default: return input;
    }
  };
});