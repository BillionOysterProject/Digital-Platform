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

  // Lesson download files
  app.route('/api/lessons/download-file').all(lessonsPolicy.isAllowed)
    .get(lessons.downloadFile);

  // Upload featured image route
  app.route('/api/lessons/:lessonId/upload-featured-image').all(lessonsPolicy.isAllowed)
    .post(lessons.uploadFeaturedImage);

  // Upload handout route
  app.route('/api/lessons/:lessonId/upload-handouts').all(lessonsPolicy.isAllowed)
    .post(lessons.uploadHandouts);

  // Upload teacher resource route
  app.route('/api/lessons/:lessonId/upload-teacher-resources').all(lessonsPolicy.isAllowed)
    .post(lessons.uploadTeacherResources);

    // Upload state test questions route
  app.route('/api/lessons/:lessonId/upload-state-test-questions').all(lessonsPolicy.isAllowed)
    .post(lessons.uploadStateTestQuestions);

  // Single lesson routes
  app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
    .get(lessons.read)
    .put(lessons.update)
    .delete(lessons.delete);

  // Finish by binding the lesson middleware
  app.param('lessonId', lessons.lessonByID);
};
