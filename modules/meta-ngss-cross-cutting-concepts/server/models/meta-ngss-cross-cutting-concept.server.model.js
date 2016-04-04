'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NGSS Cross-Cutting Concept
 */
var MetaNgssCrossCuttingConceptSchema = new Schema({
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

mongoose.model('MetaNgssCrossCuttingConcept', MetaNgssCrossCuttingConceptSchema);
