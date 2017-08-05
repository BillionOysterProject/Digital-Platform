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
  collectionTime: Date,
  latitude: Number,
  longitude: Number,
  scribeMember: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  notes: String,
  status: {
    type: String,
    enum: ['incomplete','submitted','returned','published','unpublished'],
    default: ['incomplete'],
    required: true
  },
  submitted: Date,
  mobileOrganisms: [{
    organism: {
      type: Schema.ObjectId,
      ref: 'MobileOrganism',
    },
    count: {
      type: Number,
      default: 0
    },
    alternateName: {
      type: String
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

ProtocolMobileTrapSchema.set('versionKey', false); //TODO
mongoose.model('ProtocolMobileTrap', ProtocolMobileTrapSchema);
