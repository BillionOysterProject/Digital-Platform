'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Oyster Measurement Schema
 */
var ProtocolOysterMeasurementSchema = new Schema({
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
    enum: ['incomplete','submitted'],
    default: ['incomplete'],
    required: true
  },
  submitted: Date,
  depthOfOysterCage: {
    submergedDepthofCageM: {
      type: Number,
    }
  },
  conditionOfOysterCage: {
    oysterCagePhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    bioaccumulationOnCage: {
      type: String
    },
    notesOnDamageToCage: {
      type: String
    }
  },
  measuringOysterGrowth: {
    substrateShells: [{
      substrateShellNumber: Number,
      setDate: Date,
      source: String,
      totalNumberOfLiveOystersOnShell: Number,
      notes: String,
      outerSidePhoto: {
        originalname: String,
        mimetype: String,
        filename: String,
        path: String
      },
      innerSidePhoto: {
        originalname: String,
        mimetype: String,
        filename: String,
        path: String
      },
      measurements: [{
        sizeOfLiveOysterMM: Number
      }],
      minimumSizeOfLiveOysters: Number,
      maximumSizeOfLiveOysters: Number,
      averageSizeOfLiveOysters: Number
    }]
  },
  minimumSizeOfAllLiveOysters: {
    type: Number
  },
  maximumSizeOfAllLiveOysters: {
    type: Number
  },
  averageSizeOfAllLiveOysters: {
    type: Number
  },
  totalNumberOfAllLiveOysters: {
    type: Number
  }
});

mongoose.model('ProtocolOysterMeasurement', ProtocolOysterMeasurementSchema);
