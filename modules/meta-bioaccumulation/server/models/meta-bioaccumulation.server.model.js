'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta Bioaccumulation Schema
 */
var MetaBioaccumulationSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

mongoose.model('MetaBioaccumulation', MetaBioaccumulationSchema);