'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta true false Schema
 */
var MetaTrueFalseSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: Boolean,
    required: true
  }
});

mongoose.model('MetaTrueFalse', MetaTrueFalseSchema);
