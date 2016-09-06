'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta wind direction Schema
 */
var MetaWindDirectionSchema = new Schema({
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
  },
  abbreviation: {
    type: String,
    required: true
  }
});

mongoose.model('MetaWindDirection', MetaWindDirectionSchema);
