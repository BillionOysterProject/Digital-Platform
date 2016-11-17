'use strict';

var isLoggedIn = function(roles) {
  if (roles && roles.length === 1 && roles[0] === 'guest') {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  isLoggedIn: isLoggedIn
};
