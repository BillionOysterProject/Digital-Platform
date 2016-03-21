'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta Organism Category Schema
 */
var MetaOrganismCategorySchema = new Schema({
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

mongoose.model('MetaOrganismCategory', MetaOrganismCategorySchema);