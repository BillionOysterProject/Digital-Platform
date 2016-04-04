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
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaCclsElaScienceTechnicalSubject', MetaCclsElaScienceTechnicalSubjectSchema);
