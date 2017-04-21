'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: 'Name cannot be blank',
    trim: true
  },
  description: {
    type: String,
  },
  photo: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  schoolOrg: {
    type: Schema.ObjectId,
    ref: 'SchoolOrg'
  },
  teamLead: { //remove later
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamLeads: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Team', TeamSchema);
