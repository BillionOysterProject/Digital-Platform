'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Units Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/units',
      permissions: '*'
    }, {
      resources: '/api/units/:unitId/lessons',
      permissions: '*'
    }, {
      resources: '/api/units/:unitId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'team leader', 'team member', 'partner', 'guest'],
    allows: [{
      resources: '/api/units',
      permissions: ['get']
    }, {
      resources: '/api/units/:unitId/lessons',
      permissions: ['get']
    }, {
      resources: '/api/units/:unitId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Units Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a unit is being processed and the current user created it then allow any manipulation
  // if (req.unit && req.user && req.unit.user && req.unit.user.id === req.user.id) {
  //   return next();
  // }

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
