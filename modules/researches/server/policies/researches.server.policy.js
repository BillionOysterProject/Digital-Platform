'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  _ = require('lodash'),
  path = require('path'),
  authHelper = require(path.resolve('./modules/core/server/helpers/auth.server.helper'));

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Researches Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'team lead'],
    allows: [{
      resources: '/api/research',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/saveAsImage',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/upload-header-image',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/download',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/publish',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/return',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/feedback-list',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/feedback',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/favorite',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/unfavorite',
      permissions: '*'
    }, {
      resources: '/api/research/favorites',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/share',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId',
      permissions: '*'
    }]
  }, {
    roles: ['team member'],
    allows: [{
      resources: '/api/research',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/saveAsImage',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/upload-header-image',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/download',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/feedback-list',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/feedback',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/favorite',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/unfavorite',
      permissions: '*'
    }, {
      resources: '/api/research/favorites',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId/share',
      permissions: '*'
    }, {
      resources: '/api/research/:researchId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'team lead pending', 'team member pending', 'partner'],
    allows: [{
      resources: '/api/research',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/download',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/feedback-list',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/feedback',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/favorite',
      permissions: ['post']
    }, {
      resources: '/api/research/:researchId/unfavorite',
      permissions: ['post']
    }, {
      resources: '/api/research/favorites',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/share',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/research',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/download',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/feedback-list',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId/feedback',
      permissions: ['get']
    }, {
      resources: '/api/research/:researchId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Researches Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Research is being processed and the current user created it then allow any manipulation
  if (req.research && req.user && req.research.user && req.research.user.id === req.user.id) {
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
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
