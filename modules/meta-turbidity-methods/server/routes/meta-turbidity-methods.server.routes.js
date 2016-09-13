'use strict';

/**
 * Module dependencies
 */
var turbidityMethodsPolicy = require('../policies/meta-turbidity-methods.server.policy'),
  turbidityMethods = require('../controllers/meta-turbidity-methods.server.controller');

module.exports = function(app) {
  // Meta turbidity methods Routes
  app.route('/api/turbidity-methods').all(turbidityMethodsPolicy.isAllowed)
    .get(turbidityMethods.list)
    .post(turbidityMethods.create);

  app.route('/api/turbidity-methods/:turbidityMethodId').all(turbidityMethodsPolicy.isAllowed)
    .get(turbidityMethods.read)
    .put(turbidityMethods.update)
    .delete(turbidityMethods.delete);

  // Finish by binding the Meta turbidity method middleware
  app.param('turbidityMethodId', turbidityMethods.turbidityMethodByID);
};
