'use strict';

/**
 * Module dependencies
 */
var nyssMstPolicy = require('../policies/meta-nysss-mst.server.policy'),
  nyssMsts = require('../controllers/meta-nysss-mst.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/nysss-mst').all(nyssMstPolicy.isAllowed)
    .get(nyssMsts.list)
    .post(nyssMsts.create);

  // Single standard routes
  app.route('/api/nysss-mst/:nyssMstId').all(nyssMstPolicy.isAllowed)
    .get(nyssMsts.read)
    .put(nyssMsts.update)
    .delete(nyssMsts.delete);

  // Finish by binding the standard middleware
  app.param('nyssMstId', nyssMsts.standardByID);
};
