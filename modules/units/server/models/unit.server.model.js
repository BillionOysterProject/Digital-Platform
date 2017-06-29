'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Unit Schema
 */

//TODO - numberExpectation as array
var UnitSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  color: {
    type: String,
    default: '',
    trim: true
  },
  icon: {
    type: String,
    default: '',
    trim: true
  },
  highlights: {
    type: String,
    default: '',
    trim: true
  },
  rationale: {
    type: String,
    default: '',
    trim: true
  },
  standards: {
    cclsElaScienceTechnicalSubjects: [{
      type: Schema.ObjectId,
      ref: 'MetaCclsElaScienceTechnicalSubject'
    }],
    cclsMathematics: [{
      type: Schema.ObjectId,
      ref: 'MetaCclsMathematics'
    }],
    ngssCrossCuttingConcepts: [{
      type: Schema.ObjectId,
      ref: 'MetaNgssCrossCuttingConcept'
    }],
    ngssDisciplinaryCoreIdeas: [{
      type: Schema.ObjectId,
      ref: 'MetaNgssDisciplinaryCoreIdea'
    }],
    ngssScienceEngineeringPractices: [{
      type: Schema.ObjectId,
      ref: 'MetaNgssScienceEngineeringPractice'
    }],
    nycsssUnits: [{
      type: Schema.ObjectId,
      ref: 'MetaNycssUnit'
    }],
    nysssKeyIdeas: [{
      type: Schema.ObjectId,
      ref: 'MetaNysssKeyIdea'
    }],
    nysssMajorUnderstandings: [{
      type: Schema.ObjectId,
      ref: 'MetaNysssMajorUnderstanding'
    }],
    nysssMst: [{
      type: Schema.ObjectId,
      ref: 'MetaNysssMst'
    }]
  },
  lessons: [{
    type: Schema.ObjectId,
    ref: 'Lesson',
    default: []
  }],
  subUnits: [{
    type: Schema.ObjectId,
    ref: 'Unit',
    default: []
  }],
  parentUnits: [{
    type: Schema.ObjectId,
    ref: 'Unit',
    default: []
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updated: {
    type: Array
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: ['published'],
    required: true
  }
});

/**
 * Validations
 */
// UnitSchema.path('lessonUpload.title').validate(function(title) {
//   return !!title;
// }, 'Title cannot be blank');

// UnitSchema.path('lessonUpload.unit').validate(function(unit) {
//   return !!unit;
// }, 'Unit cannot be blank');

/**
 * Statics
 */
UnitSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username displayName').exec(cb);
};

UnitSchema.set('versionKey', false); //TODO
mongoose.model('Unit', UnitSchema);
