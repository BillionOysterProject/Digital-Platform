'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restoration Station Schema
 */
var BaselineHistory = new Schema({
  substrateShellNumber: Number,
  setDate: Date,
  source: String,
  otherSource: String,
  totalNumberOfLiveOystersAtBaseline: Number,
  totalMassOfLiveOystersAtBaselineG: Number,
  entered: {
    type: Date,
    default: Date.now
  }
});

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
    //required: true
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
  baselines: {
    substrateShell1: [BaselineHistory],
    substrateShell2: [BaselineHistory],
    substrateShell3: [BaselineHistory],
    substrateShell4: [BaselineHistory],
    substrateShell5: [BaselineHistory],
    substrateShell6: [BaselineHistory],
    substrateShell7: [BaselineHistory],
    substrateShell8: [BaselineHistory],
    substrateShell9: [BaselineHistory],
    substrateShell10: [BaselineHistory]
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('RestorationStation', RestorationStationSchema);
