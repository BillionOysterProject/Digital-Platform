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
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date
  },
  status: {
    type: String,
    enum: ['incomplete','returned','published'],
    default: ['incomplete'],
    required: true
  }
});
mongoose.model('Expedition', ExpeditionSchema);
