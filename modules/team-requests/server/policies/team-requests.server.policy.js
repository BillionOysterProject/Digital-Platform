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
 * Invoke Team Requests Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team lead'],
    allows: [{
      resources: '/api/team-requests',
      permissions: ['get']
    }, {
      resources: '/api/team-requests/:teamRequestId/approve',
      permissions: '*'
    }, {
      resources: '/api/team-requests/:teamRequestId/deny',
      permissions: '*'
    }, {
      resources: '/api/team-requests/:teamRequestId',
      permissions: ['get']
    }]
  }, {
    roles: ['admin'],
    allows: [{
      resources: '/api/team-requests',
      permissions: ['get']
    }, {
      resources: '/api/team-requests/:teamRequestId',
      permissions: ['get']
    }]
  }, {
    roles: ['team member'],
    allows: [{
      resources: '/api/team-requests',
      permissions: '*'
    }, {
      resources: '/api/team-requests/:teamRequestId',
      permissions: '*'
    }]
  }, {
    roles: ['team lead pending', 'team member pending'],
    allows: [{
      resources: '/api/team-requests',
      permissions: ['get']
    }, {
      resources: '/api/team-requests/:teamRequestId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Teams Policy Allows
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
