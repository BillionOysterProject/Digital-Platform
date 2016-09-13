'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaSalinityUnit = mongoose.model('MetaSalinityUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta salinity unit
 */
exports.create = function(req, res) {
  var salinityUnit = new MetaSalinityUnit(req.body);

  salinityUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityUnit);
    }
  });
};

/**
 * Show the current Meta salinity unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var salinityUnit = req.salinityUnit ? req.salinityUnit.toJSON() : {};

  res.json(salinityUnit);
};

/**
 * Update a Meta salinity unit
 */
exports.update = function(req, res) {
  var salinityUnit = req.salinityUnit;

  if (salinityUnit) {
    salinityUnit = _.extend(salinityUnit, req.body);

    salinityUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(salinityUnit);
      }
    });
  }
};

/**
 * Delete an Meta salinity unit
 */
exports.delete = function(req, res) {
  var salinityUnit = req.salinityUnit;

  salinityUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityUnit);
    }
  });
};

/**
 * List of Meta salinity units
 */
exports.list = function(req, res) {
  MetaSalinityUnit.find().sort('order').exec(function(err, salinityUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityUnits);
    }
  });
};

/**
 * Meta salinity unit middleware
 */
exports.salinityUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Salinity unit is invalid'
    });
  }

  MetaSalinityUnit.findById(id).exec(function (err, salinityUnit) {
    if (err) {
      return next(err);
    } else if (!salinityUnit) {
      return res.status(404).send({
        message: 'No salinity unit with that identifier has been found'
      });
    }
    req.salinityUnit = salinityUnit;
    next();
  });
};
