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
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  site: {
    type: Schema.ObjectId,
    ref: 'Site'
  },
  latitude: {
    type: Number,
    required: true
  }, 
  longitude: {
    type: Number,
    required: true
  },
  monitoringDate: {
    type: Date,
    required: true
  },
  Notes: String,
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date
  }
});
mongoose.model('Expedition', ExpeditionSchema);