'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Setting Schema
 */
var SettingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  setting: {
    type: String,
    default: '',
    trim: true,
    required: 'Setting cannot be blank'
  }
});

mongoose.model('Setting', SettingSchema);