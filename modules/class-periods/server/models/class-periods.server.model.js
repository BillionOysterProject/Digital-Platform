'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Class Period Schema
 */
var ClassPeriodSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  period: {
    type: String,
    default: '',
    trim: true,
    required: 'Period cannot be blank'
  }
});

mongoose.model('ClassPeriod', ClassPeriodSchema);