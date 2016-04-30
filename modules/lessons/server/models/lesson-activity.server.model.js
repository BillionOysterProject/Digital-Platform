'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lesson Activity Schema
 */
var LessonActivitySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: Schema.ObjectId,
    ref: 'Lesson',
    required: true
  },
  activity: {
    type: String,
    enum: ['viewed', 'downloaded', 'duplicated', 'liked', 'disliked'],
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});
mongoose.model('LessonActivity', LessonActivitySchema);
