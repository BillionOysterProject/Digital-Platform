'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Settlement Tile Schema
 */
var GridDetails = new Schema({
  organism: {
    type: Schema.ObjectId,
    ref: 'SessileOrganism'
  },
  notes: String
});

var ProtocolSettlementTileSchema = new Schema({
  collectionTime: Date,
  latitude: Number,
  longitude: Number,
  scribeMember: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  notes: String,
  status: {
    type: String,
    enum: ['incomplete','submitted','returned','published','unpublished'],
    default: ['incomplete'],
    required: true
  },
  submitted: Date,
  settlementTiles: [{
    description: String,
    tilePhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    grid1: GridDetails,
    grid2: GridDetails,
    grid3: GridDetails,
    grid4: GridDetails,
    grid5: GridDetails,
    grid6: GridDetails,
    grid7: GridDetails,
    grid8: GridDetails,
    grid9: GridDetails,
    grid10: GridDetails,
    grid11: GridDetails,
    grid12: GridDetails,
    grid13: GridDetails,
    grid14: GridDetails,
    grid15: GridDetails,
    grid16: GridDetails,
    grid17: GridDetails,
    grid18: GridDetails,
    grid19: GridDetails,
    grid20: GridDetails,
    grid21: GridDetails,
    grid22: GridDetails,
    grid23: GridDetails,
    grid24: GridDetails,
    grid25: GridDetails
  }]
});

ProtocolSettlementTileSchema.set('versionKey', false); //TODO
mongoose.model('ProtocolSettlementTile', ProtocolSettlementTileSchema);
