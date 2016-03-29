'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Expeditions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team member', 'team lead', 'user'],
    allows: [{
      resources: '/api/expeditions/:expeditionId',
      permissions: '*'
    }, {
      resources: '/api/expeditions',
      permissions: '*'
    }]
  }, {
    roles: ['admin', 'partner', 'guest'],
    allows: [{
      resources: '/api/expeditions/:expeditionId',
      permissions: ['get']
    }, {
      resources: '/api/expeditions',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Expeditions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an expedition is being processed and the current user created it then allow any manipulation
  if (req.expedition && req.user && req.expedition.user && req.expedition.user.id === req.user.id) {
    return next();
  }

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
