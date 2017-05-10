'use strict';

var yesNoSomewhat = {
  type: String,
  enum: ['yes', 'no', 'somewhat']
};

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ResearchFeedbackSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  research: {
    type: Schema.ObjectId,
    ref: 'Research',
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  title: {
    rating: Number,
    creativeToThePoint: yesNoSomewhat,
    attentionGrabbing: yesNoSomewhat,
    feedbackSuggestions: String
  },
  introduction: {
    rating: Number,
    hookTheAudience: yesNoSomewhat,
    citeThreeSources: yesNoSomewhat,
    clearHypothesis: yesNoSomewhat,
    includeOneVisual: yesNoSomewhat,
    feedbackSuggestions: String
  },
  materialMethods: {
    rating: Number,
    clearExplanation: yesNoSomewhat,
    describeAnalysis: yesNoSomewhat,
    includeVisuals: yesNoSomewhat,
    feedbackSuggestions: String
  },
  results: {
    rating: Number,
    stateConclusion: yesNoSomewhat,
    describeSurprises: yesNoSomewhat,
    quantitativeAnalysis: yesNoSomewhat,
    includeOneVisual: yesNoSomewhat,
    understandableVisuals: yesNoSomewhat,
    feedbackSuggestions: String
  },
  discussionConclusions: {
    rating: Number,
    significancePresent: yesNoSomewhat,
    discussProblems: yesNoSomewhat,
    interestingImportant: yesNoSomewhat,
    significantToEcology: yesNoSomewhat,
    explainsNextSteps: yesNoSomewhat,
    feedbackSuggestions: String
  },
  literatureCited: {
    rating: Number,
    citeThreeSourcesCorrectly: yesNoSomewhat,
    feedbackSuggestions: String
  },
  acknowledgments: {
    rating: Number,
    feedbackSuggestions: String
  },
  other: {
    rating: Number,
    feedbackSuggestions: String
  },
  generalComments: String
});
mongoose.model('ResearchFeedback', ResearchFeedbackSchema);
