'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Research Activity Schema
 */
var ResearchActivitySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  research: {
    type: Schema.ObjectId,
    ref: 'Research',
    required: true
  },
  activity: {
    type: String,
    enum: ['viewed', 'downloaded', 'shared', 'liked', 'unliked','feedback', 'submitted', 'published', 'returned'],
    required: true
  },
  additionalInfo: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});
mongoose.model('ResearchActivity', ResearchActivitySchema);
