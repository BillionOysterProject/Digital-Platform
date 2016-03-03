'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Site Schema
 */
var SiteSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }, 
  longitude: {
    type: Number,
    required: true
  }
});

mongoose.model('Site', SiteSchema);