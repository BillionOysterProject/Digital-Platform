'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  path = require('path'),
  authHelper = require(path.resolve('./modules/core/server/helpers/auth.server.helper'));

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Meta bodies of waters Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/bodies-of-water',
      permissions: '*'
    }, {
      resources: '/api/bodies-of-water/:bodyOfWaterId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'team lead', 'team member', 'partner', 'guest', 'team lead pending', 'team member pending'],
    allows: [{
      resources: '/api/bodies-of-water',
      permissions: ['get']
    }, {
      resources: '/api/bodies-of-water/:bodyOfWaterId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Meta bodies of waters Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        if (authHelper.isLoggedIn(roles)) {
          return res.status(403).json({
            message: 'User is not authorized'
          });
        } else {
          return res.status(401).json({
            message: 'User logged out'
          });
        }
      }
    }
  });
};
