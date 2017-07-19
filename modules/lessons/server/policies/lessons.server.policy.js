'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  _ = require('lodash'),
  path = require('path'),
  authHelper = require(path.resolve('./modules/core/server/helpers/auth.server.helper'));

// Using the memory backed
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Lesson Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/lessons',
      permissions: ['*']
    }, {
      resources: '/api/lessons/download-file',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/upload-featured-image',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/upload-handouts',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/upload-teacher-resources',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/upload-lesson-materials',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/upload-state-test-questions',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/publish',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/return',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/download',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/tracked-list',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/tracker-stats',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/track',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/feedback-list',
      permissions: ['*']
    }, {
      resources: '/api/lessons/:lessonId/feedback',
      permissions: ['*']
    }, {
      resources: '/api/lessons/tracked-list',
      permissions: ['*']
    }, {
      resources: '/api/lessons/favorites',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId',
      permissions: ['*']
    }]
  }, {
    roles: ['team lead'],
    allows: [{
      resources: '/api/lessons',
      permissions: '*'
    }, {
      resources: '/api/lessons/download-file',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/upload-featured-image',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/upload-handouts',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/upload-teacher-resources',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/upload-lesson-materials',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/upload-state-test-questions',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/favorite',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/unfavorite',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/tracked-list',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/download',
      permissions: '*'
    }, {
      resources: '/api/lessons/favorites',
      permissions: '*'
    }, {
      resources: '/api/lessons/tracked-list',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/tracked-list',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/tracker-stats',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/track',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/feedback-list',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId/feedback',
      permissions: '*'
    }, {
      resources: '/api/lessons/:lessonId',
      permissions: '*'
    }]
  }, {
    roles: ['team lead pending', 'partner'],
    allows: [{
      resources: '/api/lessons',
      permissions: ['get']
    }, {
      resources: '/api/lessons/download-file',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/favorite',
      permissions: ['post']
    }, {
      resources: '/api/lessons/:lessonId/unfavorite',
      permissions: ['post']
    }, {
      resources: '/api/lessons/:lessonId/download',
      permissions: ['get']
    }, {
      resources: '/api/lessons/tracked-list',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/tracked-list',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/tracker-stats',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/track',
      permissions: ['post']
    }, {
      resources: '/api/lessons/:lessonId/feedback-list',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId/feedback',
      permissions: ['post', 'get']
    }, {
      resources: '/api/lessons/favorites',
      permissions: ['get']
    }, {
      resources: '/api/lessons/:lessonId',
      permissions: ['get']
    }]
  }, {
    roles: ['team member', 'team member pending'],
    allows: [{
      resources: '/api/lessons',
      permissions: ['get']
    }, {
      resources: '/api/lessons/tracked-list',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Lessons Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a lesson is being processed and the current user created it then allow any manipulation
  if (req.lesson && req.user && ((_.indexOf(roles, 'admin') > -1) || (req.lesson.user && req.lesson.user.id === req.user.id))) {
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
