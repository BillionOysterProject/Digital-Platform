'use strict';

/**
 * Module dependencies
 */
var organismCategoriesPolicy = require('../policies/meta-organism-categories.server.policy'),
  organismCategories = require('../controllers/meta-organism-categories.server.controller');

module.exports = function (app) {
  // Organism category collection routes
  app.route('/api/organism-categories').all(organismCategoriesPolicy.isAllowed)
    .get(organismCategories.list)
    .post(organismCategories.create);

  // Single organism categories routes
  app.route('/api/organism-categories/:organismCategoryId').all(organismCategoriesPolicy.isAllowed)
    .get(organismCategories.read)
    .put(organismCategories.update)
    .delete(organismCategories.delete);

  // Finish by binding the organism categories middleware
  app.param('organismCategoryId', organismCategories.organismCategoryByID);
};
