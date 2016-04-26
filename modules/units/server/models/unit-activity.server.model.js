'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Unit Activity Schema
 */
var UnitActivitySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  unit: {
    type: Schema.ObjectId,
    ref: 'Unit',
    required: true
  },
  activity: {
    type: String,
    enum: ['viewed', 'downloaded'],
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});
mongoose.model('UnitActivity', UnitActivitySchema);
