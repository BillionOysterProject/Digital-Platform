'use strict';

/**
 * Module dependencies
 */
var settlementTilesPolicy = require('../policies/protocol-settlement-tiles.server.policy'),
  settlementTiles = require('../controllers/protocol-settlement-tiles.server.controller');

module.exports = function (app) {
  // Protocol Settlement Tiles collection routes
  app.route('/api/protocol-settlement-tiles').all(settlementTilesPolicy.isAllowed)
    // .get(settlementTiles.list)
    .post(settlementTiles.create);

  app.route('/api/protocol-settlement-tiles/:settlementTileId/index/:settlementTileIndex/upload-tile-photo').all(settlementTilesPolicy.isAllowed)
    .post(settlementTiles.uploadSettlementTilePicture);

  app.route('/api/protocol-settlement-tiles/:settlementTileId/incremental-save').all(settlementTilesPolicy.isAllowed)
    .post(settlementTiles.incrementalSave);

  app.route('/api/protocol-settlement-tiles/:settlementTileId/validate').all(settlementTilesPolicy.isAllowed)
    .post(settlementTiles.validate);

  // Single Protocol Oyster Measurements routes
  app.route('/api/protocol-settlement-tiles/:settlementTileId').all(settlementTilesPolicy.isAllowed)
    .get(settlementTiles.read)
    .put(settlementTiles.update)
    .delete(settlementTiles.delete);

  // Finish by binding the protocol settlement tiles middleware
  app.param('settlementTileId', settlementTiles.settlementTilesByID);
  app.param('settlementTileIndex', settlementTiles.settlementTileIndexByID);
};
