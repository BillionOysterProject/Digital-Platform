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
  status: {
    type: String,
    enum: ['incomplete','complete'],
    default: ['incomplete'],
    required: true
  },
  samples: [{
    depthOfWaterSampleM: {
      type: Number
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
    others: [{
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
