'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta bodies of water Schema
 */
var MetaBodyOfWaterSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill bodies of water name',
    trim: true
  }
}, { collection: 'metabodiesofwater' });

mongoose.model('MetaBodyOfWater', MetaBodyOfWaterSchema);
