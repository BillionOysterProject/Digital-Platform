'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Glossary Schema
 */
var GlossarySchema = new Schema({
  term: {
    type: String,
    required: true,
    unique: true
  },
  definition: {
    type: String,
    required: true
  },
  created: {
    type: 'Date',
    default: Date.now,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});
mongoose.model('Glossary', GlossarySchema);
