'use strict';

/**
 * Module dependencies
 */
var eventsPolicy = require('../policies/events.server.policy'),
  events = require('../controllers/events.server.controller');

module.exports = function(app) {
  // Events Routes
  app.route('/api/events').all(eventsPolicy.isAllowed)
    .get(events.list)
    .post(events.create);

  // Events download files
  app.route('/api/events/download-file').all(eventsPolicy.isAllowed)
    .get(events.downloadFile);

  // Upload featured image route
  app.route('/api/events/:eventId/upload-featured-image').all(eventsPolicy.isAllowed)
    .post(events.uploadFeaturedImage);

  // Upload resource route
  app.route('/api/events/:eventId/upload-resources').all(eventsPolicy.isAllowed)
    .post(events.uploadResources);

  app.route('/api/events/:eventId').all(eventsPolicy.isAllowed)
    .get(events.read)
    .put(events.update)
    .delete(events.delete);

  // Finish by binding the Event middleware
  app.param('eventId', events.eventByID);
};
