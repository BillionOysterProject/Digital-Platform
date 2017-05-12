'use strict';

angular.module('core').filter('roleNormalizer', function(lodash) {
  return function(input, showPending) {
    if (lodash.indexOf(input, 'admin') > -1) {
      return 'admin';
    } else if (lodash.indexOf(input, 'team lead') > -1) {
      return 'team lead';
    } else if (lodash.indexOf(input, 'team lead pending') > -1) {
      return (showPending === true) ? 'team lead pending' : 'team lead';
    } else if (lodash.indexOf(input, 'partner') > -1) {
      return 'partner';
    } else if (lodash.indexOf(input, 'team member') > -1) {
      return 'team member';
    } else if (lodash.indexOf(input, 'team member pending') > -1) {
      return (showPending === true) ? 'team member pending' : 'team member';
    } else {
      return 'user';
    }
  };
});
