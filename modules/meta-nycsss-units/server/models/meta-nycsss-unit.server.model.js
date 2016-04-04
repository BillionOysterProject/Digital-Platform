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
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNycssUnit', MetaNycssUnitSchema);
