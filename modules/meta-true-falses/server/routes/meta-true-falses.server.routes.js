'use strict';

/**
 * Module dependencies
 */
var trueFalsesPolicy = require('../policies/meta-true-falses.server.policy'),
  trueFalses = require('../controllers/meta-true-falses.server.controller');

module.exports = function(app) {
  // Meta true falses Routes
  app.route('/api/true-falses').all(trueFalsesPolicy.isAllowed)
    .get(trueFalses.list)
    .post(trueFalses.create);

  app.route('/api/true-falses/:trueFalseId').all(trueFalsesPolicy.isAllowed)
    .get(trueFalses.read)
    .put(trueFalses.update)
    .delete(trueFalses.delete);

  // Finish by binding the Meta true false middleware
  app.param('trueFalseId', trueFalses.trueFalseByID);
};
