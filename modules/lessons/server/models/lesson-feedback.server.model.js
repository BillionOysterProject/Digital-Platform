'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LessonFeedbackSchema = new Schema({
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
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  lessonEffective: {
    type: Number,
    required: true
  },
  lessonAlignWithCurriculumn: {
    type: Number,
    required: true
  },
  lessonSupportScientificPractice: {
    type: Number,
    required: true
  },
  lessonPreparesStudents: {
    type: Number,
    required: true
  },
  howLessonTaught: String,
  whyLessonTaughtNow: String,
  willTeachLessonAgain: String,
  additionalFeedback: {
    lessonSummary: String,
    lessonObjectives: String,
    materialsResources: String,
    preparation: String,
    background: String,
    instructionPlan: String,
    standards: String,
    other: String
  }
});
mongoose.model('LessonFeedback', LessonFeedbackSchema);
