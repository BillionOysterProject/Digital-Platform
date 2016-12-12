'use strict';

/**
 * Module dependencies
 */
var eventTypesPolicy = require('../policies/meta-event-types.server.policy'),
  eventTypes = require('../controllers/meta-event-types.server.controller');

module.exports = function(app) {
  // Event Types Routes
  app.route('/api/event-types').all(eventTypesPolicy.isAllowed)
    .get(eventTypes.list)
    .post(eventTypes.create);

  app.route('/api/event-types/:eventTypeId').all(eventTypesPolicy.isAllowed)
    .get(eventTypes.read)
    .put(eventTypes.update)
    .delete(eventTypes.delete);

  // Finish by binding the Meta event type middleware
  app.param('eventTypeId', eventTypes.eventTypeByID);
};
