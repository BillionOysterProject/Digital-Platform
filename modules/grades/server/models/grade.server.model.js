'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grade Schema
 */
var GradeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
    default: '',
    trim: true,
    required: 'Grade cannot be blank'
  }
});

mongoose.model('Grade', GradeSchema);