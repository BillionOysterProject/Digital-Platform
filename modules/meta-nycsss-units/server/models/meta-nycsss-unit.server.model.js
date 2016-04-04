'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NYC Science Scope & Sequence Schema
 */
var MetaNycssUnitSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNycssUnit', MetaNycssUnitSchema);
