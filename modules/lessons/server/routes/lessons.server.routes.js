'use strict';

/**
 * Module dependencies
 */
var lessonsPolicy = require('../policies/lessons.server.policy'),
  lessons = require('../controllers/lessons.server.controller');

module.exports = function (app) {
  // Lessons collection routes
  app.route('/api/lessons').all(lessonsPolicy.isAllowed)
    .get(lessons.list)
    .post(lessons.create);

  // Upload featured image route
  app.route('/api/lessons/:lessonId/upload-featured-image').all(lessonsPolicy.isAllowed)
    .post(lessons.uploadFeaturedImage);

  // Upload handout route
  app.route('/api/lessons/:lessonId/upload-handouts').all(lessonsPolicy.isAllowed)
    .get(lessons.downloadHandout)
    .post(lessons.uploadHandouts);

  // Single lesson routes
  app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
    .get(lessons.read)
    .put(lessons.update)
    .delete(lessons.delete);

  // Finish by binding the lesson middleware
  app.param('lessonId', lessons.lessonByID);
};
