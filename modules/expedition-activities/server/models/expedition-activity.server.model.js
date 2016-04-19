'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Expedition Activity Schema
 */
var ExpeditionActivitySchema = new Schema({
  activity: String,
  status: {
    type: String,
    enum: ['submitted','resubmitted'],
    default: ['submitted'],
    required: true
  },
  protocols: {
    siteCondition: {
      type: Schema.ObjectId,
      ref: 'ProtocolSiteCondition'
    },
    oysterMeasurement: {
      type: Schema.ObjectId,
      ref: 'ProtocolOysterMeasurement'
    },
    mobileTrap: {
      type: Schema.ObjectId,
      ref: 'ProtocolMobileTrap'
    },
    settlementTiles: {
      type: Schema.ObjectId,
      ref: 'ProtocolSettlementTile'
    },
    waterQuality: {
      type: Schema.ObjectId,
      ref: 'ProtocolWaterQuality'
    }
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  expedition: {
    type: Schema.ObjectId,
    ref: 'Expedition'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('ExpeditionActivity', ExpeditionActivitySchema);
