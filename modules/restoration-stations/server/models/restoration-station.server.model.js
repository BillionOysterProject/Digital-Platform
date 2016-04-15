'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restoration Station Schema
 */
var RestorationStationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  schoolOrg: {
    type: Schema.ObjectId,
    ref: 'SchoolOrg'
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  bodyOfWater: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Lost'],
    default: ['Active'],
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('RestorationStation', RestorationStationSchema);
