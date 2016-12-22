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
  title: {
    type: String,
    default: '',
    required: 'Please fill in Event title',
    trim: true
  },
  dates: [{
    startDateTime: Date,
    endDateTime: Date,
  }],
  category: {
    type: {
      // type: String,
      // enum: ['professional development', 'field training', 'workshop', 'expedition', 'other'],
      type: Schema.ObjectId,
      ref: 'MetaEventType',
      required: 'Please fill in Event category'
    },
    otherType: String
  },
  deadlineToRegister: {
    type: Date
  },
  location: {
    addressString: String,
    latitude: Number,
    longitude: Number,
  },
  cost: String,
  maximumCapacity: Number,
  description: {
    type: String,
    required: 'Please fill in Event description'
  },
  skillsTaught: String,
  featuredImage: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  resources: {
    resourcesLinks: [{
      name: String,
      link: {
        type: String,
        trim: true
      }
    }],
    resourcesFiles: [{
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }],
  },
  registrants: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    registrationDate: Date,
    attended: Boolean,
    note: String
  }],
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
