'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lesson Tracker Schema
 */
var LessonTrackerSchema = new Schema({
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
  taughtOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  classOrSubject: {
    type: Schema.ObjectId,
    ref: 'MetaSubjectArea',
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  totalNumberOfStudents: {
    type: Number,
    required: true
  },
  totalNumberOfClassesOrSections: {
    type: Number,
    required: true
  },
  classPeriodsOrSessionsNeededToComplete: {
    type: Number,
    required: true
  }
});
mongoose.model('LessonTracker', LessonTrackerSchema);
