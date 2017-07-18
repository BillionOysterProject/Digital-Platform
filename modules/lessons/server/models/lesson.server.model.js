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
    trim: true
  },
  explore: {
    type: String,
    trim: true
  },
  explain: {
    type: String,
    trim: true
  },
  elaborate: {
    type: String,
    trim: true
  },
  evaluate: {
    type: String,
    trim: true
  },
  extend: {
    type: String,
    trim: true
  }
};

var LessonSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true

  },
  unit: {
    type: Schema.ObjectId,
    ref: 'Unit'
  },
  units: [{
    type: Schema.ObjectId,
    ref: 'Unit'
  }],
  featuredImage: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
  },
  lessonOverview: {
    grade: {
      type: String
    },
    classPeriods: {
      type: String
    },
    setting: {
      type: String
    },
    subjectAreas: [{
      type: Schema.ObjectId,
      ref: 'MetaSubjectArea'
    }],
    lessonSummary: {
      type: String,
      trim: true
    }
  },
  lessonObjectives: {
    type: String,
    trim: true
  },
  materialsResources: {
    supplies: {
      type: String,
      trim: true
    },
    teacherTips: {
      type: String,
      trim: true
    },
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
    lessonMaterialLinks: [{
      name: String,
      link: {
        type: String,
        trim: true
      }
    }],
    lessonMaterialFiles: [{
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }],
    handoutLinks: [{
      name: String,
      link: {
        type: String,
        trim: true
      }
    }],
    handoutsFileInput: [{
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }],
    stateTestQuestionLinks: [{
      name: String,
      link: {
        type: String,
        trim: true
      }
    }],
    stateTestQuestions: [{
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    }],
    vocabulary: [{
      type: Schema.ObjectId,
      ref: 'Glossary'
    }]
  },
  background: {
    type: String,
    trim: true
  },
  preparation: {
    type: String,
    trim: true
  },
  instructionPlan: {
    type: instructionPlans,
    validate: instructionPlanValidator
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
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'returned'],
    default: ['draft'],
    required: true
  },
  returnedNotes: {
    type: String
  },
  downloadPdf: {
    originalname: String,
    mimetype: String,
    filename: String,
    path: String
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
  if (value.cclsElaScienceTechnicalSubjects || value.cclsMathematics || value.ngssCrossCuttingConcepts ||
    value.ngssDisciplinaryCoreIdeas || value.ngssScienceEngineeringPractices || value.nycsssUnits ||
    value.nysssKeyIdeas || value.nysssMajorUnderstandings || value.nysssMst) {
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

LessonSchema.set('versionKey', false); //TODO
mongoose.model('Lesson', LessonSchema);
