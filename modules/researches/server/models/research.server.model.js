'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Research Schema
 */
var ResearchSchema = new Schema({
  headerImage: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  color: {
    type: String,
    trim: true,
    required: 'Please fill Research color'
  },
  font: {
    type: String,
    trim: true,
    required: 'Please fill Research font'
  },
  title: {
    type: String,
    default: '',
    required: 'Please fill Research title',
    trim: true
  },
  intro: {
    type: String,
  },
  methods: {
    type: String
  },
  results: {
    type: String
  },
  discussion: {
    type: String
  },
  cited: {
    type: String
  },
  acknowledgments: {
    type: String
  },
  other: {
    title: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'returned'],
    default: 'draft',
    required: true
  },
  returnedNotes: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: [{
    type: Date
  }],
  submitted: [{
    type: Date
  }],
  published: [{
    type: Date
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  downloadImage: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  }
});

mongoose.model('Research', ResearchSchema);
