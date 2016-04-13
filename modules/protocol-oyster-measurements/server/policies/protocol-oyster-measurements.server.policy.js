'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

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
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId/incremental-save',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId',
      permissions: '*'
    }, {
      resources: '/api/protocol-oyster-measurements',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'partner', 'guest'],
    allows: [{
      resources: '/api/protocol-oyster-measurements/:oysterMeasurementId',
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
