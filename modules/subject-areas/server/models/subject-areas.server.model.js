'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subject Areas Schema
 */
var SubjectAreaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  subject: {
    type: String,
    default: '',
    trim: true,
    required: 'Subject cannot be blank'
  }
});

mongoose.model('SubjectArea', SubjectAreaSchema);