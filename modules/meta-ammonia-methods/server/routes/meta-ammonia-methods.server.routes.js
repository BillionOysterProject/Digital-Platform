'use strict';

/**
 * Module dependencies
 */
var ammoniaMethodsPolicy = require('../policies/meta-ammonia-methods.server.policy'),
  ammoniaMethods = require('../controllers/meta-ammonia-methods.server.controller');

module.exports = function(app) {
  // Meta ammonia methods Routes
  app.route('/api/ammonia-methods').all(ammoniaMethodsPolicy.isAllowed)
    .get(ammoniaMethods.list)
    .post(ammoniaMethods.create);

  app.route('/api/ammonia-methods/:ammoniaMethodId').all(ammoniaMethodsPolicy.isAllowed)
    .get(ammoniaMethods.read)
    .put(ammoniaMethods.update)
    .delete(ammoniaMethods.delete);

  // Finish by binding the Meta ammonia method middleware
  app.param('ammoniaMethodId', ammoniaMethods.ammoniaMethodByID);
};
