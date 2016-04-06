'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Saved Lesson Schema
 */
var SavedLessonSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lesson: {
    type: Schema.ObjectId,
    ref: 'Lesson'
  }
});

mongoose.model('SavedLesson', SavedLessonSchema);
