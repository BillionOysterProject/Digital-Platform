'use strict';

/**
 * Module dependencies
 */
var mobileTrapsPolicy = require('../policies/protocol-mobile-traps.server.policy'),
  mobileTraps = require('../controllers/protocol-mobile-traps.server.controller');

module.exports = function (app) {

  app.route('/api/protocol-mobile-traps/:mobileTrapId/organisms/:organismId/upload-sketch-photo').all(mobileTrapsPolicy.isAllowed)
    .post(mobileTraps.uploadSketchPhoto);

  app.route('/api/protocol-mobile-traps/:mobileTrapId/validate').all(mobileTrapsPolicy.isAllowed)
    .post(mobileTraps.validate);

  // Single Protocol Mobile Traps routes
  app.route('/api/protocol-mobile-traps/:mobileTrapId').all(mobileTrapsPolicy.isAllowed)
    .get(mobileTraps.read)
    .put(mobileTraps.update);

  // Finish by binding the protocol mobile traps middleware
  app.param('mobileTrapId', mobileTraps.mobileTrapByID);
  app.param('organismId', mobileTraps.organismIdByID);
};
