'use strict';

/**
 * Module dependencies
 */
var boroughsCountiesPolicy = require('../policies/meta-boroughs-counties.server.policy'),
  boroughsCounties = require('../controllers/meta-boroughs-counties.server.controller');

module.exports = function(app) {
  // Meta boroughs counties Routes
  app.route('/api/boroughs-counties').all(boroughsCountiesPolicy.isAllowed)
    .get(boroughsCounties.list)
    .post(boroughsCounties.create);

  app.route('/api/boroughs-counties/:boroughCountyId').all(boroughsCountiesPolicy.isAllowed)
    .get(boroughsCounties.read)
    .put(boroughsCounties.update)
    .delete(boroughsCounties.delete);

  // Finish by binding the Meta boroughs county middleware
  app.param('boroughCountyId', boroughsCounties.boroughCountyByID);
};
