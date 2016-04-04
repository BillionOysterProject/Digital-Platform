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

mongoose.model('MetaNgssDisciplinaryCoreIdea', MetaNgssDisciplinaryCoreIdeaSchema);
