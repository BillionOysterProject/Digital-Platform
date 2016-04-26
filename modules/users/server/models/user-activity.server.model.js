'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Activity Schema
 */
var UserActivitySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: String,
    enum: ['login'],
    default: 'login',
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});
mongoose.model('UserActivity', UserActivitySchema);
