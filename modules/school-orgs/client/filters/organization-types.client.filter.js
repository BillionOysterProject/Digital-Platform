'use strict';

angular.module('school-orgs').filter('organizationTypes', function() {
  return function(input) {
    switch(input) {
      case 'school': return 'School';
      case 'business': return 'Business';
      case 'government': return 'Government';
      case 'property owner': return 'Property Owner';
      case 'community organization': return 'Community Organization';
      case 'other': return 'Other';
      default: return input;
    }
  };
});
