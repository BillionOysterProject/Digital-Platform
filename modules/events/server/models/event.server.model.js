'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Calendar Event Schema
 */
var CalendarEventSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Calendar Event name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CalendarEvent', CalendarEventSchema);
