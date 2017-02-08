'use strict';

/**
 * Module dependencies
 */
var researchesPolicy = require('../policies/researches.server.policy'),
  researches = require('../controllers/researches.server.controller');

module.exports = function(app) {
  // Researches Routes
  app.route('/api/researches').all(researchesPolicy.isAllowed)
    .get(researches.list)
    .post(researches.create);

  app.route('/api/researches/:researchId').all(researchesPolicy.isAllowed)
    .get(researches.read)
    .put(researches.update)
    .delete(researches.delete);

  // Finish by binding the Research middleware
  app.param('researchId', researches.researchByID);
};
