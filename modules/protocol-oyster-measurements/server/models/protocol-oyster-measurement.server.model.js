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
  status: {
    type: String,
    enum: ['incomplete','complete'],
    default: ['incomplete'],
    required: true
  },
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
