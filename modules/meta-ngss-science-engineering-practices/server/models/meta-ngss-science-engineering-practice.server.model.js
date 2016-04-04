'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta NGSS Science and Engineering Practice
 */
var MetaNgssScienceEngineeringPracticeSchema = new Schema({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaNgssScienceEngineeringPractice', MetaNgssScienceEngineeringPracticeSchema);
