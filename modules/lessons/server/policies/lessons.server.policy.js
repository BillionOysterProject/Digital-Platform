'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

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
      resources: '/api/lessons/:lessonId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Lessons Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  
  // If a lesson is being processed and the current user created it then allow any manipulation
  // if (req.lesson && req.user && req.lesson.user && req.lesson.user.id === req.user.id) {
  //   return next();
  // }

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