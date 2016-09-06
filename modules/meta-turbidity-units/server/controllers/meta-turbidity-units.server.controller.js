'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaTurbidityUnit = mongoose.model('MetaTurbidityUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta turbidity unit
 */
exports.create = function(req, res) {
  var turbidityUnit = new MetaTurbidityUnit(req.body);

  turbidityUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityUnit);
    }
  });
};

/**
 * Show the current Meta turbidity unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var turbidityUnit = req.turbidityUnit ? req.turbidityUnit.toJSON() : {};

  res.json(turbidityUnit);
};

/**
 * Update a Meta turbidity unit
 */
exports.update = function(req, res) {
  var turbidityUnit = req.turbidityUnit;

  if (turbidityUnit) {
    turbidityUnit = _.extend(turbidityUnit, req.body);

    turbidityUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(turbidityUnit);
      }
    });
  }
};

/**
 * Delete an Meta turbidity unit
 */
exports.delete = function(req, res) {
  var turbidityUnit = req.turbidityUnit;

  turbidityUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityUnit);
    }
  });
};

/**
 * List of Meta turbidity units
 */
exports.list = function(req, res) {
  MetaTurbidityUnit.find().sort('order').exec(function(err, turbidityUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityUnits);
    }
  });
};

/**
 * Meta turbidity unit middleware
 */
exports.turbidityUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Turbidity unit is invalid'
    });
  }

  MetaTurbidityUnit.findById(id).exec(function (err, turbidityUnit) {
    if (err) {
      return next(err);
    } else if (!turbidityUnit) {
      return res.status(404).send({
        message: 'No turbidity unit with that identifier has been found'
      });
    }
    req.turbidityUnit = turbidityUnit;
    next();
  });
};
