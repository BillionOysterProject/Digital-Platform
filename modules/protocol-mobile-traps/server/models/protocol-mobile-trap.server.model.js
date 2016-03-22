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
  expedition: {
    type: Schema.ObjectId,
    ref: 'Expedition',
    //required: true TODO: will be required
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team',
    //required: true TODO: will be required
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User',
    //required: true TODO: will be required
  }],
  mobileOrganisms: [{
    organism: {
      type: Schema.ObjectId,
      ref: 'MobileOrganism',
      required: true
    },
    count: {
      type: Number,
      required: true,
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