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
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId/approve',
      permissions: '*'
    }, {
      resources: '/api/users/:userId/deny',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }, {
      resources: '/api/users/username',
      permissions: '*'
    }, {
      resources: '/api/users/leaders',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/organization/:orgId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/team/:teamId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/remind',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/csv',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/validate/csv',
      permissions: '*'
    }]
  }, {
    roles: ['team lead'],
    allows: [{
      resources: '/api/users',
      permissions: ['get']
    }, {
      resources: '/api/users/leaders',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/team/:teamId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/remind',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/csv',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/validate/csv',
      permissions: '*'
    }]
  }, {
    roles: ['org lead'],
    allows: [{
      resources: '/api/users',
      permissions: ['get']
    }, {
      resources: '/api/users/leaders',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/organization/:orgId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId/remind',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/:userId',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/csv',
      permissions: '*'
    }, {
      resources: '/api/users/leaders/validate/csv',
      permissions: '*'
    }]
  }, {
    roles: ['team member'],
    allows: [{
      resources: '/api/users',
      permissions: ['get']
    }, {
      resources: '/api/users/leaders/:userId',
      permissions: ['put']
    }, {
      resources: '/api/users/teamleads',
      permissions: ['get']
    }]
  }, {
    roles: ['team member pending', 'team lead pending'],
    allows: [{
      resources: '/api/users/leaders/:userId',
      permissions: ['put']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/users/username',
      permissions: ['get']
    }, {
      resources: '/api/users/:userId',
      permissions: ['get']
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
