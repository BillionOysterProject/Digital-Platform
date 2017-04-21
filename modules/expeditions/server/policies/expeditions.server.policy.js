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
 * Invoke Expeditions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team lead', 'admin'],
    allows: [{
      resources: '/api/expeditions/:expeditionId/submit',
      permissions: '*'
    }, {
      resources: '/api/expeditions/:expeditionId/publish',
      permissions: '*'
    }, {
      resources: '/api/expeditions/:expeditionId/return',
      permissions: '*'
    }, {
      resources: '/api/expeditions/:expeditionId/unpublish',
      permissions: '*'
    }, {
      resources: '/api/expeditions/:expeditionId',
      permissions: '*'
    }, {
      resources: '/api/expeditions/compare',
      permissions: '*'
    }, {
      resources: '/api/expeditions/export',
      permissions: '*'
    }, {
      resources: '/api/expeditions/restoration-station',
      permissions: '*'
    }, {
      resources: '/api/expeditions',
      permissions: '*'
    }]
  }, {
    roles: ['team member'],
    allows: [{
      resources: '/api/expeditions/:expeditionId/submit',
      permissions: '*'
    }, {
      resources: '/api/expeditions/:expeditionId',
      permissions: '*'
    }, {
      resources: '/api/expeditions/compare',
      permissions: '*'
    }, {
      resources: '/api/expeditions/export',
      permissions: '*'
    }, {
      resources: '/api/expeditions/restoration-station',
      permissions: '*'
    }, {
      resources: '/api/expeditions',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'partner', 'guest', 'team lead pending', 'team member pending'],
    allows: [{
      resources: '/api/expeditions/:expeditionId',
      permissions: ['get']
    }, {
      resources: '/api/expeditions/compare',
      permissions: '*'
    }, {
      resources: '/api/expeditions/export-compare',
      permissions: '*'
    }, {
      resources: '/api/expeditions/restoration-station',
      permissions: '*'
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
