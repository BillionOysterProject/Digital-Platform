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
  organizationType: {
    type: String,
    enum: [
      'school',
      'business',
      'government',
      'property owner',
      'community organization',
      'college',
      'other',
    ],
    default: 'other',
    required: 'Organization type cannot be blank'
  },
  schoolType: {
    type: String,
    enum: [
      'nyc-public',
      'nyc-charter',
      'private',
      'other-public',
    ],
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  photo: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
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
  },
  orgLeads: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  syncId: {
    type: String
  },
  principal: {
    type: String,
  },
  principalPhone: {
    type: String,
  },
  communityBoard: {
    type: String,
  },
  district: {
    type: String,
  },
  gradesTaught: [{
    type: Schema.Types.Mixed,
  }],
  gradeLevels: {
    type: String,
  },
  locationType: {
    type: String,
  },
  website: {
    type: String,
  },
});

mongoose.model('SchoolOrg', SchoolOrgSchema);
