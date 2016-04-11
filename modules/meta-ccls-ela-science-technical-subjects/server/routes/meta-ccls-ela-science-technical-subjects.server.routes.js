'use strict';

/**
 * Module dependencies
 */
var metaCclsElaPolicy = require('../policies/meta-ccls-ela-science-technical-subjects.server.policy'),
  metaCclsElas = require('../controllers/meta-ccls-ela-science-technical-subjects.server.controller');

module.exports = function (app) {
  // Single metaCclsEla routes
  app.route('/api/ccls-ela-science-technical-subjects/:metaCclsElaId').all(metaCclsElaPolicy.isAllowed)
    .get(metaCclsElas.read)
    .put(metaCclsElas.update)
    .delete(metaCclsElas.delete);

  // Standard collection routes
  app.route('/api/ccls-ela-science-technical-subjects').all(metaCclsElaPolicy.isAllowed)
    .get(metaCclsElas.list)
    .post(metaCclsElas.create);

  // Finish by binding the standard middleware
  app.param('metaCclsElaId', metaCclsElas.standardByID);
};
