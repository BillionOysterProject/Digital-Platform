'use strict';

/**
 * Module dependencies
 */
var glossaryPolicy = require('../policies/glossary.server.policy'),
  glossary = require('../controllers/glossary.server.controller');

module.exports = function (app) {
  // Glossary collection routes
  app.route('/api/glossary').all(glossaryPolicy.isAllowed)
    .get(glossary.list)
    .post(glossary.create);

  // Single term routes
  app.route('/api/glossary/:termId').all(glossaryPolicy.isAllowed)
    .get(glossary.read)
    .put(glossary.update)
    .delete(glossary.delete);

  // Finish by binding the glossary middleware
  app.param('termId', glossary.termByID);
};
