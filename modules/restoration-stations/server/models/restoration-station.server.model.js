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
    // required: true // moved to Sites
  },
  longitude: {
    type: Number,
    // required: true // moved to Sites
  },
  bodyOfWater: {
    type: String,
    // required: true // moved to Sites
  },
  boroughCounty: {
    type: String,
    // required: true // moved to Sites
  },
  shoreLineType: {
    type: String,
    // required: true // moved to Sites
  },
  status: {
    type: String,
    enum: ['Active', 'Damaged', 'Destroyed', 'Lost', 'Unknown'],
    default: ['Active'],
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['Active', 'Damaged', 'Destroyed', 'Lost', 'Unknown'],
      default: ['Active']
    },
    description: String,
    photo: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }
  }],
  notes: {
    type: String
  },
  site: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  tagNumber: {
    type: String
  },
  photo: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  siteCoordinator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  otherSiteCoordinator: {
    name: String,
    email: String
  },
  propertyOwner: {
    type: Schema.ObjectId,
    ref: 'MetaPropertyOwner'
  },
  otherPropertyOwner: {
    name: String,
    email: String
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
