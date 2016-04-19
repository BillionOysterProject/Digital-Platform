'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * School Organization Schema
 */
var SchoolOrgSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number,
  }
});

mongoose.model('SchoolOrg', SchoolOrgSchema);
