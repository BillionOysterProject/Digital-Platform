'use strict';

/**
 * Module dependencies
 */
var propertyOwnersPolicy = require('../policies/meta-property-owners.server.policy'),
  propertyOwners = require('../controllers/meta-property-owners.server.controller');

module.exports = function(app) {
  // Meta property owners Routes
  app.route('/api/property-owners').all(propertyOwnersPolicy.isAllowed)
    .get(propertyOwners.list)
    .post(propertyOwners.create);

  app.route('/api/property-owners/:propertyOwnerId').all(propertyOwnersPolicy.isAllowed)
    .get(propertyOwners.read)
    .put(propertyOwners.update)
    .delete(propertyOwners.delete);

  // Finish by binding the Meta property owner middleware
  app.param('propertyOwnerId', propertyOwners.propertyOwnerByID);
};
