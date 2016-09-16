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
    teacherResourcesLinks: [{
      name: String,
      link: {
        type: String,
        trim: true
      }
    }],
    teacherResourcesFiles: [{
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }],
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
