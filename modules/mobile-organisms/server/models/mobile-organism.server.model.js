'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mobile Organism Schema
 */
var MobileOrganismSchema = new Schema({
  commonName: {
    type: String,
    required: true
  }, 
  latinName: {
    type: String,
    required: true
  }, 
  category: {
    type: String,
    required: true
  }, 
  description: {
    type: String,
    required: true
  },
  nativeIntroduced: String,
  habitat: {
    type: String,
    required: true
  },
  diet: {
    type: String,
    required: true
  },
  morphologyNotes: {
    type: String,
    required: true
  },
  citation: {
    type: String,
    required: true
  },
  image: {
    path: String
  },
  invasive: Boolean, 
  predator: Boolean, 
  reefassociate: Boolean, 
  mobile: Boolean, 
  settlement: Boolean
});
mongoose.model('MobileOrganism', MobileOrganismSchema);