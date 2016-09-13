'use strict';

/**
 * Module dependencies
 */
var phMethodsPolicy = require('../policies/meta-ph-methods.server.policy'),
  phMethods = require('../controllers/meta-ph-methods.server.controller');

module.exports = function(app) {
  // Meta ph methods Routes
  app.route('/api/ph-methods').all(phMethodsPolicy.isAllowed)
    .get(phMethods.list)
    .post(phMethods.create);

  app.route('/api/ph-methods/:phMethodId').all(phMethodsPolicy.isAllowed)
    .get(phMethods.read)
    .put(phMethods.update)
    .delete(phMethods.delete);

  // Finish by binding the Meta ph method middleware
  app.param('phMethodId', phMethods.phMethodByID);
};
