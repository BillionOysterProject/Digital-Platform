'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaDissolvedOxygenUnit = mongoose.model('MetaDissolvedOxygenUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta dissolved oxygen unit
 */
exports.create = function(req, res) {
  var dissolvedOxygenUnit = new MetaDissolvedOxygenUnit(req.body);

  dissolvedOxygenUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenUnit);
    }
  });
};

/**
 * Show the current Meta dissolved oxygen unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dissolvedOxygenUnit = req.dissolvedOxygenUnit ? req.dissolvedOxygenUnit.toJSON() : {};

  res.json(dissolvedOxygenUnit);
};

/**
 * Update a Meta dissolved oxygen unit
 */
exports.update = function(req, res) {
  var dissolvedOxygenUnit = req.dissolvedOxygenUnit;

  if (dissolvedOxygenUnit) {
    dissolvedOxygenUnit = _.extend(dissolvedOxygenUnit, req.body);

    dissolvedOxygenUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(dissolvedOxygenUnit);
      }
    });
  }
};

/**
 * Delete an Meta dissolved oxygen unit
 */
exports.delete = function(req, res) {
  var dissolvedOxygenUnit = req.dissolvedOxygenUnit;

  dissolvedOxygenUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenUnit);
    }
  });
};

/**
 * List of Meta dissolved oxygen units
 */
exports.list = function(req, res) {
  MetaDissolvedOxygenUnit.find().sort('order').exec(function(err, dissolvedOxygenUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenUnits);
    }
  });
};

/**
 * Meta dissolved oxygen unit middleware
 */
exports.dissolvedOxygenUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dissolved oxygen unit is invalid'
    });
  }

  MetaDissolvedOxygenUnit.findById(id).exec(function (err, dissolvedOxygenUnit) {
    if (err) {
      return next(err);
    } else if (!dissolvedOxygenUnit) {
      return res.status(404).send({
        message: 'No dissolved oxygen unit with that identifier has been found'
      });
    }
    req.dissolvedOxygenUnit = dissolvedOxygenUnit;
    next();
  });
};
