'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamRequestSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  teamLead: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  requester: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('TeamRequest', TeamRequestSchema);
