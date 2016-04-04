'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NGSS Disciplinary Core Idea
 */
var MetaNgssDisciplinaryCoreIdeaSchema = new Schema({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNgssDisciplinaryCoreIdea', MetaNgssDisciplinaryCoreIdeaSchema);
