'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta CCLS ELS Science & Technical Subject Schema
 */
var MetaCclsElaScienceTechnicalSubjectSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

mongoose.model('MetaCclsElaScienceTechnicalSubject', MetaCclsElaScienceTechnicalSubjectSchema);
