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
 * Invoke Events Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/events',
      permissions: '*'
    }, {
      resources: '/api/events/download-file',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/upload-featured-image',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/upload-resources',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/register',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/unregister',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/attended',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/not-attended',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/note',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/email-registrants',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId',
      permissions: '*'
    }]
  }, {
    roles: ['team lead', 'team lead pending', 'partner'],
    allows: [{
      resources: '/api/events',
      permissions: ['get', 'post']
    }, {
      resources: '/api/events/download-file',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId/register',
      permissions: ['post']
    }, {
      resources: '/api/events/:eventId/unregister',
      permissions: ['post']
    }, {
      resources: '/api/events/:eventId',
      permissions: ['get', 'post']
    }]
  }, {
    roles: ['guest', 'user', 'team member', 'team member pending'],
    allows: [{
      resources: '/api/events',
      permissions: ['get']
    }, {
      resources: '/api/events/download-file',
      permissions: ['*']
    }, {
      resources: '/api/events/:eventId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Events Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Event is being processed and the current user created it then allow any manipulation
  if (req.event && req.user && req.event.user && req.event.user.id === req.user.id) {
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
