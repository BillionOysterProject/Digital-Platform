'use strict';

/**
 * Module dependencies
 */
var tideTables = require('../controllers/meta-tide-tables.server.controller');

module.exports = function (app) {
  // Tide Table routes
  app.route('/api/tide-tables')
    .get(tideTables.tideTables);
};