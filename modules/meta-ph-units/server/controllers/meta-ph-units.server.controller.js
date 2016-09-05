'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaPhUnit = mongoose.model('MetaPhUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta ph unit
 */
exports.create = function(req, res) {
  var phUnit = new MetaPhUnit(req.body);

  phUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phUnit);
    }
  });
};

/**
 * Show the current Meta ph unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var phUnit = req.phUnit ? req.phUnit.toJSON() : {};

  res.json(phUnit);
};

/**
 * Update a Meta ph unit
 */
exports.update = function(req, res) {
  var phUnit = req.phUnit;

  if (phUnit) {
    phUnit = _.extend(phUnit, req.body);

    phUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(phUnit);
      }
    });
  }
};

/**
 * Delete an Meta ph unit
 */
exports.delete = function(req, res) {
  var phUnit = req.phUnit;

  phUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phUnit);
    }
  });
};

/**
 * List of Meta ph units
 */
exports.list = function(req, res) {
  MetaPhUnit.find().sort('order').exec(function(err, phUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phUnits);
    }
  });
};

/**
 * Meta ph unit middleware
 */
exports.phUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'pH unit is invalid'
    });
  }

  MetaPhUnit.findById(id).exec(function (err, phUnit) {
    if (err) {
      return next(err);
    } else if (!phUnit) {
      return res.status(404).send({
        message: 'No pH unit with that identifier has been found'
      });
    }
    req.phUnit = phUnit;
    next();
  });
};
