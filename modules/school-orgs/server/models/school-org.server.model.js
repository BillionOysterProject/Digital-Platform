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
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description cannot be blank'
  },
  streetAddress: {
    type: String,
    default: '',
    trim: true,
    required: 'Street address cannot be blank'
  },
  city: {
    type: String,
    default: '',
    trim: true,
    required: 'City cannot be blank'
  },
  state: {
    type: String,
    default: '',
    trim: true,
    required: 'State cannot be blank'
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number,
  },
  pending: {
    type: Boolean,
    default: false
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('SchoolOrg', SchoolOrgSchema);
