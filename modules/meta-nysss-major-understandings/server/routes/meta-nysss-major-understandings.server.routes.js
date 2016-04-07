'use strict';

/**
 * Module dependencies
 */
var metaNysssMuPolicy = require('../policies/meta-nysss-major-understandings.server.policy'),
  metaNysssMus = require('../controllers/meta-nysss-major-understandings.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/nysss-major-understandings/:metaNysssMuId').all(metaNysssMuPolicy.isAllowed)
    .get(metaNysssMus.read)
    .put(metaNysssMus.update)
    .delete(metaNysssMus.delete);

  // Standard collection routes
  app.route('/api/nysss-major-understandings').all(metaNysssMuPolicy.isAllowed)
    .get(metaNysssMus.list)
    .post(metaNysssMus.create);

  // Finish by binding the standard middleware
  app.param('metaNysssMuId', metaNysssMus.standardByID);
};
