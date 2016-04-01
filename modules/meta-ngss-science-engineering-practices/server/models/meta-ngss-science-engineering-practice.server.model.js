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

mongoose.model('MetaNgssScienceEngineeringPractice', MetaNgssScienceEngineeringPracticeSchema);
