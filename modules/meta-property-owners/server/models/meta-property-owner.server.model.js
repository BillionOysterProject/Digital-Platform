'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta property owner Schema
 */
var MetaPropertyOwnerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill property owner name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('MetaPropertyOwner', MetaPropertyOwnerSchema);
