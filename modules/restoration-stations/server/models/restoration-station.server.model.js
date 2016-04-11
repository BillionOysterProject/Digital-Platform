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
    enum: ['active', 'lost'],
    default: ['active'],
    required: true
  }
});

mongoose.model('RestorationStation', RestorationStationSchema);
