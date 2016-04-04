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
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNysssMajorUnderstanding', MetaNysssMajorUnderstandingSchema);
