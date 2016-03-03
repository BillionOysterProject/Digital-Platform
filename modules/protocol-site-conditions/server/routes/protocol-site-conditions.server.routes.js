'use strict';

/**
 * Module dependencies
 */
var siteConditionsPolicy = require('../policies/protocol-site-conditions.server.policy'),
  siteConditions = require('../controllers/protocol-site-conditions.server.controller');

module.exports = function (app) {
  // Protocol Site Condition collection routes
  app.route('/api/protocol-site-conditions').all(siteConditionsPolicy.isAllowed)
    // .get(siteConditions.list)
    .post(siteConditions.create);

  // Single Protocol Site Condition routes
  app.route('/api/protocol-site-conditions/:siteConditionId').all(siteConditionsPolicy.isAllowed)
    .get(siteConditions.read)
    .put(siteConditions.update)
    .delete(siteConditions.delete);

  // Finish by binding the protocol site condition midleware
  app.param('siteConditionId', siteConditions.siteConditionByID);
};