'use strict';

/**
 * Module dependencies
 */
var oysterMeasurementsPolicy = require('../policies/protocol-oyster-measurements.server.policy'),
  oysterMeasurements = require('../controllers/protocol-oyster-measurements.server.controller');

module.exports = function (app) {
  // Protocol Oyster Measurements collection routes
  app.route('/api/protocol-oyster-measurements').all(oysterMeasurementsPolicy.isAllowed)
    // .get(oysterMeasurements.list)
    .post(oysterMeasurements.create);

  // Upload Oyster Cage Condition route
  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId/upload-oyster-cage-condition').all(oysterMeasurementsPolicy.isAllowed)
    .post(oysterMeasurements.uploadOysterCageConditionPicture);

  // Single Protocol Oyster Measurements routes
  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId').all(oysterMeasurementsPolicy.isAllowed)
    .get(oysterMeasurements.read)
    .put(oysterMeasurements.update)
    .delete(oysterMeasurements.delete);

  // Finish by binding the protocol oyster measurements middleware
  app.param('oysterMeasurementId', oysterMeasurements.oysterMeasurementByID);
};