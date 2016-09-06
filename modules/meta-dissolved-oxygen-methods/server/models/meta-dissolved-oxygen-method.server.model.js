'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meta dissolved oxygen method Schema
 */
var MetaDissolvedOxygenMethodSchema = new Schema({
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

mongoose.model('MetaDissolvedOxygenMethod', MetaDissolvedOxygenMethodSchema);
