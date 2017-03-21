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

  app.route('/api/restoration-stations/site-coordinators').all(stationsPolicy.isAllowed)
    .get(stations.listSiteCoordinators);

  app.route('/api/restoration-stations/property-owners').all(stationsPolicy.isAllowed)
    .get(stations.listPropertyOwners);

  // Upload station photo route
  app.route('/api/restoration-stations/:stationId/upload-image').all(stationsPolicy.isAllowed)
    .post(stations.uploadStationPhoto);

  app.route('/api/restoration-stations/:stationId/upload-status-image/:statusHistoryIndex').all(stationsPolicy.isAllowed)
    .post(stations.uploadStationStatusPhoto);

  app.route('/api/restoration-stations/:stationId/send-status/:statusHistoryIndex').all(stationsPolicy.isAllowed)
    .post(stations.sendORSStatusEmail);

  app.route('/api/restoration-stations/:stationId/status-history').all(stationsPolicy.isAllowed)
    .post(stations.updateStatusHistory);

  // Add a baseline history to a substrate shell
  app.route('/api/restoration-stations/:stationId/substrate-history').all(stationsPolicy.isAllowed)
    .post(stations.updateBaselines);

  app.route('/api/restoration-stations/:stationId/measurement-chart-data').all(stationsPolicy.isAllowed)
    .get(stations.measurementChartData);

  // Single restoration station routes
  app.route('/api/restoration-stations/:stationId').all(stationsPolicy.isAllowed)
    .get(stations.read)
    .put(stations.update)
    .delete(stations.delete);

  // Finish by binding the restoration station middleware
  app.param('stationId', stations.stationByID);
  app.param('statusHistoryIndex', stations.statusHistoryByIndex);
};
