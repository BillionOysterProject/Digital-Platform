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
  teamLead: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Team', TeamSchema);