'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Expedition Schema
 */
var ExpeditionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  station: {
    type: Schema.ObjectId,
    ref: 'RestorationStation'
  },
  monitoringStartDate: {
    type: Date,
    required: true
  },
  monitoringEndDate: {
    type: Date,
    required: true
  },
  notes: String,
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
  teamLists: {
    siteCondition: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    oysterMeasurement: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    mobileTrap: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    settlementTiles: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    waterQuality: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date
  },
  status: {
    type: String,
    enum: ['incomplete','returned','pending','published'],
    default: ['incomplete'],
    required: true
  },
  published: Date
});
mongoose.model('Expedition', ExpeditionSchema);
