'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  path = require('path'),
  authHelper = require(path.resolve('./modules/core/server/helpers/auth.server.helper'));

// Using the memory backed
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Organism Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sessile-organisms',
      permissions: ['*']
    }, {
      resources: '/api/sessile-organisms/:sessileOrganismId/upload-images',
      permissions: ['*']
    }, {
      resources: '/api/sessile-organisms/:sessileOrganismId',
      permissions: ['*']
    }]
  }, {
    roles: ['team lead', 'team member', 'user', 'guest'],
    allows: [{
      resources: '/api/sessile-organisms',
      permissions: ['get']
    }, {
      resources: '/api/sessile-organisms/:sessileOrganismId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Organisms Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a lesson is being processed and the current user created it then allow any manipulation
  // if (req.lesson && req.user && req.lesson.user && req.lesson.user.id === req.user.id) {
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
