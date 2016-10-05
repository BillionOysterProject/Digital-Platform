'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restoration Station Schema
 */
var RestorationStationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  teamLead: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  schoolOrg: {
    type: Schema.ObjectId,
    ref: 'SchoolOrg',
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  bodyOfWater: {
    type: String,
    required: true
  },
  boroughCounty: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Lost'],
    default: ['Active'],
    required: true
  },
  photo: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  baselineHistory: [{
    substrateShells: [{
      substrateShellNumber: Number,
      setDate: Date,
      source: String,
      otherSource: String,
      totalNumberOfLiveOystersAtBaseline: Number,
      entered: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('RestorationStation', RestorationStationSchema);
