'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta Subject Areas Schema
 */
var MetaSubjectAreaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    default: '',
    trim: true,
    required: 'Subject cannot be blank'
  },
  color: {
    type: String,
    trim: true,
    required: 'Color cannot be blank'
  }
});

mongoose.model('MetaSubjectArea', MetaSubjectAreaSchema);
