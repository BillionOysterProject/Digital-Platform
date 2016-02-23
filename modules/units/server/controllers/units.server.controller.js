'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Unit = mongoose.model('Unit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var unit = new Unit(req.body);
  unit.user = req.user;

  unit.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(unit);
    }
  });
};

 /**
  * Show the current unit
  */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var unit = req.unit ? req.unit.toJSON() : {};

  // Add a custom field to the Unit, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since ti doesn't exist in the Unit model.
  unit.isCurrentUserOwner = req.user && unit.user && unit.user._id.toString() === req.user._id.toString() ? true: false;

  res.json(unit);
};

/**
 * Update a unit
 */
exports.update = function (req, res) {
  var unit = req.unit;

  unit.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(unit);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var unit = req.unit;

  unit.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(unit);
    }
  });
};

/**
 *
 */
exports.list = function (req, res) {
  Unit.find().sort('-created').populate('user', 'displayName').exec(function (err, units) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(units);
    }
  });
};

/** 
 * Units middleware
 */
exports.unitByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Unit is invalid'
    });
  }

  Unit.findById(id).populate('user', 'displayName').exec(function (err, unit) {
    if (err) {
      return next(err);
    } else if (!unit) {
      return res.status(404).send({
        message: 'No unit with that indentifier has been found'
      });
    }
    req.unit = unit;
    next();
  });
};