'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sessile Organism Schema
 */
var SessileOrganismSchema = new Schema({
  commonName: {
    type: String
  },
  latinName: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  additionalTaxonomicInformation: {
    type: String,
    required: true
  },
  firstInformation: {
    type: String,
    required: true
  },
  speciesOrigin: {
    type: String,
    required: true
  },
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
  migration: {
    type: String,
    require: true
  },
  image: {
    path: String
  }
});
mongoose.model('SessileOrganism', SessileOrganismSchema);
