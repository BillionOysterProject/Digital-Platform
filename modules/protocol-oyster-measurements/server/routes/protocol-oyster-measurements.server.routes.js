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

  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId/index/:substrateIndex/upload-outer-substrate').all(oysterMeasurementsPolicy.isAllowed)
    .post(oysterMeasurements.uploadOuterSubstratePicture);

  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId/index/:substrateIndex/upload-inner-substrate').all(oysterMeasurementsPolicy.isAllowed)
    .post(oysterMeasurements.uploadInnerSubstratePicture);

  // Upload Oyster Cage Condition route
  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId/upload-oyster-cage-condition').all(oysterMeasurementsPolicy.isAllowed)
    .post(oysterMeasurements.uploadOysterCageConditionPicture);

  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId/incremental-save').all(oysterMeasurementsPolicy.isAllowed)
    .post(oysterMeasurements.incrementalSave);

  // Previous Protocol Oyster Measurements routes
  app.route('/api/protocol-oyster-measurements/:currentOysterMeasurementId/previous').all(oysterMeasurementsPolicy.isAllowed)
    .get(oysterMeasurements.read);

  // Single Protocol Oyster Measurements routes
  app.route('/api/protocol-oyster-measurements/:oysterMeasurementId').all(oysterMeasurementsPolicy.isAllowed)
    .get(oysterMeasurements.read)
    .put(oysterMeasurements.update)
    .delete(oysterMeasurements.delete);

  // Finish by binding the protocol oyster measurements middleware
  app.param('oysterMeasurementId', oysterMeasurements.oysterMeasurementByID);
  app.param('substrateIndex', oysterMeasurements.substrateIndexByID);
  app.param('currentOysterMeasurementId', oysterMeasurements.previousOysterMeasurement);
};
