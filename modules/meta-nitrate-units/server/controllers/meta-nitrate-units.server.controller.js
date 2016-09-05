'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaNitrateUnit = mongoose.model('MetaNitrateUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta nitrate unit
 */
exports.create = function(req, res) {
  var nitrateUnit = new MetaNitrateUnit(req.body);

  nitrateUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateUnit);
    }
  });
};

/**
 * Show the current Meta nitrate unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var nitrateUnit = req.nitrateUnit ? req.nitrateUnit.toJSON() : {};

  res.json(nitrateUnit);
};

/**
 * Update a Meta nitrate unit
 */
exports.update = function(req, res) {
  var nitrateUnit = req.metaNitrateUnit;

  if (nitrateUnit) {
    nitrateUnit = _.extend(nitrateUnit, req.body);

    nitrateUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(nitrateUnit);
      }
    });
  }
};

/**
 * Delete an Meta nitrate unit
 */
exports.delete = function(req, res) {
  var nitrateUnit = req.nitrateUnit;

  nitrateUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateUnit);
    }
  });
};

/**
 * List of Meta nitrate units
 */
exports.list = function(req, res) {
  MetaNitrateUnit.find().sort('order').exec(function(err, nitrateUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateUnits);
    }
  });
};

/**
 * Meta nitrate unit middleware
 */
exports.nitrateUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Nitrate unit is invalid'
    });
  }

  MetaNitrateUnit.findById(id).exec(function (err, nitrateUnit) {
    if (err) {
      return next(err);
    } else if (!nitrateUnit) {
      return res.status(404).send({
        message: 'No nitrate unit with that identifier has been found'
      });
    }
    req.nitrateUnit = nitrateUnit;
    next();
  });
};
