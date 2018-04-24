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
 * Invoke Protocol Mobile Trap Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team member', 'team lead', 'admin'],
    allows: [{
      resources: '/api/protocol-mobile-traps/:mobileTrapId/organisms/:organismId/upload-sketch-photo',
      permissions: '*'
    }, {
      resources: '/api/protocol-mobile-traps/:mobileTrapId/validate',
      permissions: '*'
    }, {
      resources: '/api/protocol-mobile-traps/:mobileTrapId',
      permissions: '*'
    }]
  }, {
    roles: ['partner', 'guest', 'user'],
    allows: [{
      resources: '/api/protocol-mobile-traps/:mobileTrapId',
      permissions: ['get', 'put']
    }]
  }]);
};

/**
 * Check if Protocol Site Condition Policy allows
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
