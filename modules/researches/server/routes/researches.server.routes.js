'use strict';

/**
 * Module dependencies
 */
var researchesPolicy = require('../policies/researches.server.policy'),
  researches = require('../controllers/researches.server.controller');

module.exports = function(app) {
  // Researches Routes
  app.route('/api/research').all(researchesPolicy.isAllowed)
    .get(researches.list)
    .post(researches.create);

  app.route('/api/research/:researchId/upload-header-image').all(researchesPolicy.isAllowed)
    .post(researches.uploadHeaderImage);

  app.route('/api/research/:researchId/download').all(researchesPolicy.isAllowed)
    .get(researches.download);

  app.route('/api/research/:researchId/publish').all(researchesPolicy.isAllowed)
    .post(researches.publish);

  app.route('/api/research/:researchId/return').all(researchesPolicy.isAllowed)
    .post(researches.return);

  app.route('/api/research/:researchId').all(researchesPolicy.isAllowed)
    .get(researches.read)
    .put(researches.update)
    .delete(researches.delete);

  // Finish by binding the Research middleware
  app.param('researchId', researches.researchByID);
};
