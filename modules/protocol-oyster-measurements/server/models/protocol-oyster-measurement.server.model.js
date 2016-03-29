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
  depthOfOysterCage: {
    submergedDepthofCageM: {
      type: Number,
      required: true
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
      type: String,
      required: true
    },
    notesOnDamageToCage: {
      type: String,
      required: true
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
    type: Number,
    required: true
  },
  maximumSizeOfAllLiveOysters: {
    type: Number,
    required: true
  },
  averageSizeOfAllLiveOysters: {
    type: Number,
    required: true
  },
  totalNumberOfAllLiveOysters: {
    type: Number,
    required: true
  }
});

mongoose.model('ProtocolOysterMeasurement', ProtocolOysterMeasurementSchema);