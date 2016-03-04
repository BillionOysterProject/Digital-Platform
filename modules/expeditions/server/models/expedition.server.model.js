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
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
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
  dateTime: {
    type: Date,
    required: true
  },
  notes: String
});
mongoose.model('Expedition', ExpeditionSchema);