'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta CCLS Mathematics Schema
 */
var MetaCclsMathematicsSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('MetaCclsMathematics', MetaCclsMathematicsSchema);
