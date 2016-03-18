'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Bioaccumulation Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/bioaccumulations',
      permissions: '*'
    }, {
      resources: '/api/bioaccumulations/:bioaccumulationId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'team lead', 'team member', 'partner', 'guest'],
    allows: [{
      resources: '/api/bioaccumulations',
      permissions: ['get']
    }, {
      resources: '/api/bioaccumulations/:bioaccumulationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Water Flow Policy Allows
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
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
