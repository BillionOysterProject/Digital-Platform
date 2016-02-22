'use strict';

/**
 * Module dependencies
 */
var lessonsPolicy = require('../policies/lesson.server.policy'),
  lessons = require('../controllers/lesson.server.controller');

module.exports = function (app) {
  // Lessons collection routes
  app.route('/api/lessons').all(lessonsPolicy.isAllowed)
    .get(lessons.list)
    .post(lessons.create);

  // Single lesson routes
  app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
    .get(lessons.read)
    .put(lessons.update)
    .delete(lessons.delete);

  // Finish by binding the lesson middleware
  app.param('lessonId', lessons.lessonByID);
};
