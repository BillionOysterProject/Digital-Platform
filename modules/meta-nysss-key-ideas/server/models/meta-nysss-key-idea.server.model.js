'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NYS Science Standard Key Idea
 */
var MetaNysssKeyIdeaSchema = new Schema({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNysssKeyIdea', MetaNysssKeyIdeaSchema);
