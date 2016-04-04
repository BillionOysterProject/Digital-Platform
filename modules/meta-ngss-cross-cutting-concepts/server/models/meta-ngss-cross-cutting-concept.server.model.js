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
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNgssCrossCuttingConcept', MetaNgssCrossCuttingConceptSchema);
