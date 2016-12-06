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

  // Lesson incremental save
  app.route('/api/lessons/:lessonId/incremental-save').all(lessonsPolicy.isAllowed)
    .post(lessons.incrementalSave);

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

  // Publish lesson route
  app.route('/api/lessons/:lessonId/publish').all(lessonsPolicy.isAllowed)
    .post(lessons.publish);

  app.route('/api/lessons/:lessonId/return').all(lessonsPolicy.isAllowed)
    .post(lessons.return);

  // Saved Lesson routes
  app.route('/api/lessons/:lessonId/favorite').all(lessonsPolicy.isAllowed)
    .post(lessons.favoriteLesson);

  app.route('/api/lessons/:lessonId/unfavorite').all(lessonsPolicy.isAllowed)
    .post(lessons.unfavoriteLesson);

  app.route('/api/lessons/:lessonId/download').all(lessonsPolicy.isAllowed)
    .get(lessons.downloadZip);

  app.route('/api/lessons/favorites').all(lessonsPolicy.isAllowed)
    .get(lessons.listFavorites);

  app.route('/api/lessons/:lessonId/tracked-list').all(lessonsPolicy.isAllowed)
    .get(lessons.listTrackedForLessonAndUser);

  app.route('/api/lessons/:lessonId/track').all(lessonsPolicy.isAllowed)
    .post(lessons.trackLesson);

  app.route('/api/lessons/:lessonId/feedback-list').all(lessonsPolicy.isAllowed)
    .get(lessons.listFeedbackForLesson);

  app.route('/api/lessons/:lessonId/feedback').all(lessonsPolicy.isAllowed)
    .post(lessons.lessonFeedback);

  // Single lesson routes
  app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
    .get(lessons.read)
    .put(lessons.update)
    .delete(lessons.delete);

  // Finish by binding the lesson middleware
  app.param('lessonId', lessons.lessonByID);
};
