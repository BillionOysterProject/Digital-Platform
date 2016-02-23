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
  stageOne: {
    unitTitle: {
      lessonTitle: {
        type: String,
        required: true,
        trim: true
      }
    },
    desiredResults: {
      fieldWork: {
        type: String,
        required: false,
        trim: true
      },
      scienceContent: {
        type: String,
        required: false,
        trim: true
      }
    },
    essentialQuestons: [{
      question: {
        type: Array,
        required: false
      }
    }],
    acquisition: {
      scienceContentSkills: {
        type: String,
        required: false,
        trim: true
      },
      mathContentSkills: {
        type: String,
        required: false,
        trim: true
      },
      fieldContentSkills: {
        type: String,
        required: false,
        trim: true
      }
    },
    lessons: {
      scienceLessons: {
        type: String,
        required: false,
        trim: true
      },
      mathLessons: {
        type: String,
        required: false,
        trim: true
      },
      fieldLessons: {
        type: String,
        required: false,
        trim: true
      }
    }
  },
  stage2: {
    stage2Evidence: {
      numberExpectation: {
        type: String,
        required: false
      },
      scienceAndEngineering: {
        type: String,
        required: false,
        trim: true
      },
      disciplinaryCoreIdeas: {
        type: String,
        required: false,
        trim: true
      },
      crossCuttingConcepts: {
        type: String,
        required: false,
        trim: true
      }
    },
    assessmentEvidence: {
      researchProject: {
        type: String,
        required: false,
        trim: true
      },
      extensions: {
        type: String,
        required: false,
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
    default: ['team lead']
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
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Unit', UnitSchema);