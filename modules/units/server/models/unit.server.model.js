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
    required: 'Title is required',
    default: '',
    trim: true
  },
  color: {
    type: String,
    required: 'Color is required',
    default: '',
    trim: true
  },
  icon: {
    type: String,
    required: 'Icon is required',
    default: '',
    trim: true
  },
  stageOne: {
    enduringUnderstandings: {
      fieldWork: {
        type: String,
        required: 'Field work is required',
        default: '',
        trim: true
      },
      scienceContent: {
        type: String,
        required: 'Science content is required',
        default: '',
        trim: true
      }
    },
    essentialQuestions: [{
      type: String,
      trim: true
    }],
    acquisition: {
      content: {
        science: [{
          type: String
        }],
        math: [{
          type: String
        }],
        field: [{
          type: String
        }],
      },
      lessons: {
        science: [{
          type: String
        }],
        math: [{
          type: String
        }],
        field: [{
          type: String
        }]
      }
    }
  },
  stageTwo: {
    evidence: {
      expectations: [{
        type: String,
      }],
      scienceAndEngineering: {
        type: String,
        trim: true
      },
      disciplinaryCoreIdeas: {
        type: String,
        trim: true
      },
      crossCuttingConcepts: {
        type: String,
        trim: true
      }
    },
    assessmentEvidence: {
      researchProjects: [{
        type: String
      }],
      extentions: {
        type: String,
        trim: true
      }
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: {
    type: [{
      type: String
    }],
    default: ['admin']
  },
  updated: {
    type: Array
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

mongoose.model('Unit', UnitSchema);