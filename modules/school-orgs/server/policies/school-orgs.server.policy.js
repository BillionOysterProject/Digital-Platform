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
 * Invoke Teams Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['guest'],
    allows: [{
      resources: '/api/school-orgs/:schoolOrgId/teams',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads/:teamLeadId',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId',
      permissions: 'get'
    }]
  }, {
    roles: ['admin', 'org lead'],
    allows: [{
      resources: '/api/school-orgs/:schoolOrgId/teams',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads/:teamLeadId',
      permissions: '*'
    }, {
      resources: '/api/school-orgs',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/approve',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/deny',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/upload-image',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId',
      permissions: '*'
    }]
  }, {
    roles: ['team lead', 'org lead'],
    allows: [{
      resources: '/api/school-orgs/:schoolOrgId/teams',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads/:teamLeadId',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/upload-image',
      permissions: '*'
    }, {
      resources: '/api/school-orgs/:schoolOrgId',
      permissions: 'get'
    }]
  }, {
    roles: ['user', 'team member', 'partner'],
    allows: [{
      resources: '/api/school-orgs/:schoolOrgId/teams',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId/team-leads/:teamLeadId',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs',
      permissions: 'get'
    }, {
      resources: '/api/school-orgs/:schoolOrgId',
      permissions: 'get'
    }]
  }]);
};

/**
 * Check If Teams Policy Allows
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
