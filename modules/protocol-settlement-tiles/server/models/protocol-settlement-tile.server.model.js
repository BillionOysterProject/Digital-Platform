'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Settlement Tile Schema
 */
var ProtocolSettlementTileSchema = new Schema({
  settlementTiles: [{
    description: String,
    tilePhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    grids: [{
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    }]
  }]
});

mongoose.model('ProtocolSettlementTile', ProtocolSettlementTileSchema);
