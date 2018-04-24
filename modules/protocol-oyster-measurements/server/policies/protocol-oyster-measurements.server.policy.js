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
 * Invoke Protocol Oyster Measurements Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['team member', 'team lead', 'admin'],
    allows: [{
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId/index/:substrateIndex/upload-outer-substrate',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId/index/:substrateIndex/upload-inner-substrate',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId/upload-oyster-cage-condition',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId/validate',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:currentOysterMeasurementId/previous',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'partner', 'guest'],
    allows: [{
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId',
      permissions: ['get']
    }, {
      resources: '/api/protocol-oyster-measurements/:currentOysterMeasurementId/previous',
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
