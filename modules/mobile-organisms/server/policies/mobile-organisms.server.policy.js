'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backed
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Organism Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/mobile-organisms',
      permissions: ['*']
    }, {
      resources: '/api/mobile-organisms/:mobileOrganismId/upload-images',
      permissions: ['*']
    }, {
      resources: '/api/mobile-organisms/:mobileOrganismId',
      permissions: ['*']
    }]
  }, {
    roles: ['team lead', 'team member', 'user', 'guest'],
    allows: [{
      resources: '/api/mobile-organisms',
      permissions: '*'
    }, {
      resources: '/api/mobile-organisms/:mobileOrganismId/upload-images',
      permissions: '*'
    }, {
      resources: '/api/mobile-organisms/:mobileOrganismId',
      permissions: '*'
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
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};