'use strict';

/**
 * Module dependencies
 */
var dissolvedOxygenMethodsPolicy = require('../policies/meta-dissolved-oxygen-methods.server.policy'),
  dissolvedOxygenMethods = require('../controllers/meta-dissolved-oxygen-methods.server.controller');

module.exports = function(app) {
  // Meta dissolved oxygen methods Routes
  app.route('/api/dissolved-oxygen-methods').all(dissolvedOxygenMethodsPolicy.isAllowed)
    .get(dissolvedOxygenMethods.list)
    .post(dissolvedOxygenMethods.create);

  app.route('/api/dissolved-oxygen-methods/:dissolvedOxygenMethodId').all(dissolvedOxygenMethodsPolicy.isAllowed)
    .get(dissolvedOxygenMethods.read)
    .put(dissolvedOxygenMethods.update)
    .delete(dissolvedOxygenMethods.delete);

  // Finish by binding the Meta dissolved oxygen method middleware
  app.param('dissolvedOxygenMethodId', dissolvedOxygenMethods.dissolvedOxygenMethodByID);
};
