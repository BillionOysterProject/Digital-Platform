'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Saved Research Schema
 */
var SavedResearchSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  research: {
    type: Schema.ObjectId,
    ref: 'Research'
  }
});

mongoose.model('SavedResearch', SavedResearchSchema);
