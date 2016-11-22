'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta event type Schema
 */
var MetaEventTypeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: '',
    trim: true,
    required: 'Type cannot be blank'
  },
  color: {
    type: String,
    trim: true,
    required: 'Color cannot be blank'
  }
});

mongoose.model('MetaEventType', MetaEventTypeSchema);
