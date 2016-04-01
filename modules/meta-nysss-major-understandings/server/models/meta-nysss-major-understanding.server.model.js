'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NYS Science Stanard Major Understanding
 */
var MetaNysssMajorUnderstandingSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNysssMajorUnderstanding', MetaNysssMajorUnderstandingSchema);
