'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Lesson Schema
 */
//TODO > make handoutsFileInput, vocabulary, nycScienceScopeSequence, ngssStandards, commonCoreEla, commonCoreMath
var instructionPlans = {
  engage: {
    type: String,
    required: false,
    trim: true
  },
  explore: {
    type: String,
    required: false,
    trim: true
  },
  explain: {
    type: String,
    required: false,
    trim: true
  },
  elaborate: {
    type: String,
    required: false,
    trim: true
  },
  evaluate: {
    type: String,
    required: false,
    trim: true
  }
};

var standardsOptions = {
  nycScienceScopeSequence: {
    type: String,
    required: false
  },
  ngssStandards: {
    type: String,
    required: false
  },
  commonCoreEla: {
    type: String,
    required: false
  },
  commonCoreMath: {
    type: String,
    required: false
  }
};

var LessonSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lessonUpload: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
    }
  },
  lessonOverview: {
    grade: {
      type: String,
      required: true,
      trim: true
    },
    classPeriods: {
      type: String,
      required: true,
      trim: true
    },
    setting: {
      type: String,
      required: true,
      trim: true
    },
    subjectAreas: {
      type: String,
      required: true,
      trim: true
    },
    protocolConnections: {
      type: String,
      required: true,
      trim: true
    },
    lessonSummary: {
      type: String,
      required: true,
      trim: true
    }
  },
  lessonObjectives: {
    type: String,
    required: true,
    trim: true
  },
  materialsResources: {
    supplies: {
      type: String,
      required: true,
      trim: true
    },
    teacherResources: {
      type: String,
      required: true,
      trim: true
    },
    handoutsFileInput: {
      type: String,
      required: false
    },
    vocabulary: {
      type: String,
      required: false
    }
  },
  background: {
    type: String,
    required: false,
    trim: true
  },
  instructionPlan: {
    type: instructionPlans,
    validate: instructionPlanValidator
  },
  standards: {
    type: standardsOptions,
    validate: standardsValidator
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // permissions: {
  //   type: Array
  // },
  // updated: {
  //   type: Array
  // }
});

/**
 * Validations
 */
LessonSchema.path('lessonUpload.title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

LessonSchema.path('lessonUpload.unit').validate(function(unit) {
  return !!unit;
}, 'Unit cannot be blank');

function instructionPlanValidator(value) {
  if (value.engage || value.explore || value.explain || value.elaborate || value.evaluate) {
    return true;
  } else {
    return false;
  }
}

function standardsValidator(value) {
  if (value.nycScienceScopeSequence || value.ngssStandards || value.commonCoreEla || value.commonCoreMath) {
    return true;
  } else {
    return false;
  }
}

/**
 * Statics
 */
LessonSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Lesson', LessonSchema);
