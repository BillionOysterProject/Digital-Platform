'use strict';

/**
 * Module dependencies
 */
var nitrateMethodsPolicy = require('../policies/meta-nitrate-methods.server.policy'),
  nitrateMethods = require('../controllers/meta-nitrate-methods.server.controller');

module.exports = function(app) {
  // Meta nitrates methods Routes
  app.route('/api/nitrate-methods').all(nitrateMethodsPolicy.isAllowed)
    .get(nitrateMethods.list)
    .post(nitrateMethods.create);

  app.route('/api/nitrate-methods/:nitrateMethodId').all(nitrateMethodsPolicy.isAllowed)
    .get(nitrateMethods.read)
    .put(nitrateMethods.update)
    .delete(nitrateMethods.delete);

  // Finish by binding the Meta nitrates method middleware
  app.param('nitrateMethodId', nitrateMethods.nitrateMethodByID);
};
