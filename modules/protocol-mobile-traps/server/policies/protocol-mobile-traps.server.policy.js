'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Protocol Mobile Trap Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team member', 'team lead', 'user'],
    allows: [{
      resources: '/api/protocol-mobile-traps/:mobileTrapId/organisms/:organismId/upload-sketch-photo',
      permissions: '*'
    }, {
      resources: '/api/protocol-mobile-traps/:mobileTrapId',
      permissions: '*'
    }, {
      resources: '/api/protocol-mobile-traps',
      permissions: '*'
    }]
  }, {
    roles: ['admin', 'partner', 'guest'],
    allows: [{
      resources: '/api/protocol-mobile-traps/:mobileTrapId',
      permissions: ['get']
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
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};