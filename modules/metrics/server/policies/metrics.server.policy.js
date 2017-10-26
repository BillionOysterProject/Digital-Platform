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
 * Invoke Metrics Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/metrics/download/misc',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/team-leads',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/events',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/team-members',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/organizations',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/lessons',
      permissions: ['*']
    },{
      resources: '/api/metrics/download/expeditions',
      permissions: ['*']
    },{
      resources: '/api/metrics/people-with-admin',
      permissions: ['*']
    }]
  },
  {
    roles: ['admin', 'team lead'],
    allows: [{
      resources: '/api/metrics/people',
      permissions: ['*']
    }, {
      resources: '/api/metrics/activeUsers',
      permissions: ['*']
    }, {
      resources: '/api/metrics/curriculum',
      permissions: ['*']
    }, {
      resources: '/api/metrics/curriculum/units/monthlyTotals',
      permissions: ['*']
    },{
      resources: '/api/metrics/curriculum/lessons/monthlyTotals',
      permissions: ['*']
    }, {
      resources: '/api/metrics/stations',
      permissions: ['*']
    }, {
      resources: '/api/metrics/stations/monthlyTotals',
      permissions: ['*']
    }, {
      resources: '/api/metrics/expeditions/monthlyTotals',
      permissions: ['*']
    }, {
      resources: '/api/metrics/events',
      permissions: ['*']
    }, {
      resources: '/api/metrics/events/monthlyTotals',
      permissions: ['*']
    }, {
      resources: '/api/metrics/events/statistics',
      permissions: ['*']
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
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
