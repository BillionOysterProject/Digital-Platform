'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Water Quality Schema
 */
var ProtocolWaterQualitySchema = new Schema({
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
  samples: [{
    depthOfWaterSampleM: {
      type: Number,
      required: true
    },
    locationOfWaterSample: {
      latitude: Number,
      longitude: Number
    },
    waterTemperature: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    dissolvedOxygen: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    salinity: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    pH: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    turbidity: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    ammonia: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    nitrates: {
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    },
    other: [{
      label: String,
      method: String,
      results: [{
        type: Number
      }],
      average: Number,
      units: String
    }]
  }],
  bacteriaCountMPN: Number
});

mongoose.model('ProtocolWaterQuality', ProtocolWaterQualitySchema);