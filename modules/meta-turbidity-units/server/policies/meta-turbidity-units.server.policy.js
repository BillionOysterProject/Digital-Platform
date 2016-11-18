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
 * Invoke Meta turbidity units Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/turbidity-units',
      permissions: '*'
    }, {
      resources: '/api/turbidity-units/:turbidityUnitId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/turbidity-units',
      permissions: ['get', 'post']
    }, {
      resources: '/api/turbidity-units/:turbidityUnitId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/turbidity-units',
      permissions: ['get']
    }, {
      resources: '/api/turbidity-units/:turbidityUnitId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Meta turbidity units Policy Allows
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
