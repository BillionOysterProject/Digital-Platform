'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta boroughs county Schema
 */
var MetaBoroughsCountySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill borough/county name',
    trim: true
  }
});

mongoose.model('MetaBoroughsCounty', MetaBoroughsCountySchema);
