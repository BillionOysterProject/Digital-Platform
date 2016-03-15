'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Oyster Measurement Schema 
 */
var ProtocolOysterMeasurementSchema = new Schema({
  expedition: {
    type: Schema.ObjectId,
    ref: 'Expedition',
    //required: true TODO: will be required
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User',
    //required: true TODO: will be required
  }],
  
});