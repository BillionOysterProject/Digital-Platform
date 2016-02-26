'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  crate = require('mongoose-crate'),
  LocalFS = require('mongoose-crate-localfs'),
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
  nycScienceScopeSequence: [{
    type: String,
    required: false
  }],
  ngssStandards: [{
    type: String,
    required: false
  }],
  commonCoreEla: [{
    type: String,
    required: false
  }],
  commonCoreMath: [{
    type: String,
    required: false
  }]
};

var LessonSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'

  },
  unit: {
    type: Schema.ObjectId,
    ref: 'Unit',
    require: 'Unit cannot be blank'
  },
  lessonOverview: {
    grade: {
      type: String,
      required: true
    },
    classPeriods: {
      type: String,
      required: true
    },
    setting: {
      type: String,
      required: true
    },
    subjectAreas: [{
      type: String,
      required: true
    }],
    protocolConnections: [{
      type: String,
      required: true,
      trim: true
    }],
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
      //required: true, should be required, not all set up yet
      trim: true
    },
    handoutsFileInput: {
      type: String,
      required: false
    },
    vocabulary: [{
      type: String,
      required: false
    }]
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
  }).populate('user', 'name username displayName').exec(cb);
};

LessonSchema.plugin(crate, {
  storage: new LocalFS({
    directory: 'files/'
  }),
  fields: {
    handout: {}
  }
});

mongoose.model('Lesson', LessonSchema);
