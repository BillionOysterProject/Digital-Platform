'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mobile Trap Schema
 */
var ProtocolMobileTrapSchema = new Schema({
  status: {
    type: String,
    enum: ['incomplete','complete'],
    default: ['incomplete'],
    required: true
  },
  mobileOrganisms: [{
    organism: {
      type: Schema.ObjectId,
      ref: 'MobileOrganism',
    },
    count: {
      type: Number,
      default: 0
    },
    sketchPhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    notesQuestions: String
  }]
});

mongoose.model('ProtocolMobileTrap', ProtocolMobileTrapSchema);
