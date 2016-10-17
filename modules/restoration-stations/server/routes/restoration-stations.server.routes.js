'use strict';

/**
 * Module dependencies
 */
var stationsPolicy = require('../policies/restoration-stations.server.policy'),
  stations = require('../controllers/restoration-stations.server.controller');

module.exports = function (app) {
  // Restoration Stations collection routes
  app.route('/api/restoration-stations').all(stationsPolicy.isAllowed)
    .get(stations.list)
    .post(stations.create);

  // Upload station photo route
  app.route('/api/restoration-stations/:stationId/upload-image').all(stationsPolicy.isAllowed)
    .post(stations.uploadStationPhoto);

  // Add a baseline history to a substrate shell
  app.route('/api/restoration-stations/:stationId/substrate-history').all(stationsPolicy.isAllowed)
    .post(stations.updateBaselines);

  // Single restoration station routes
  app.route('/api/restoration-stations/:stationId').all(stationsPolicy.isAllowed)
    .get(stations.read)
    .put(stations.update)
    .delete(stations.delete);

  // Finish by binding the restoration station middleware
  app.param('stationId', stations.stationByID);
};
