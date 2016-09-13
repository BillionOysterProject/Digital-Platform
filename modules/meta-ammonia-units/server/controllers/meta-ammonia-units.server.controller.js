'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaAmmoniaUnit = mongoose.model('MetaAmmoniaUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta ammonia unit
 */
exports.create = function(req, res) {
  var ammoniaUnit = new MetaAmmoniaUnit(req.body);

  ammoniaUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaUnit);
    }
  });
};

/**
 * Show the current Meta ammonia unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ammoniaUnit = req.ammoniaUnit ? req.ammoniaUnit.toJSON() : {};

  res.json(ammoniaUnit);
};

/**
 * Update a Meta ammonia unit
 */
exports.update = function(req, res) {
  var ammoniaUnit = req.ammoniaUnit;

  if (ammoniaUnit) {
    ammoniaUnit = _.extend(ammoniaUnit, req.body);

    ammoniaUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(ammoniaUnit);
      }
    });
  }
};

/**
 * Delete an Meta ammonia unit
 */
exports.delete = function(req, res) {
  var ammoniaUnit = req.ammoniaUnit;

  ammoniaUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaUnit);
    }
  });
};

/**
 * List of Meta ammonia units
 */
exports.list = function(req, res) {
  MetaAmmoniaUnit.find().sort('order').exec(function(err, ammoniaUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaUnits);
    }
  });
};

/**
 * Meta ammonia unit middleware
 */
exports.ammoniaUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ammonia unit is invalid'
    });
  }

  MetaAmmoniaUnit.findById(id).exec(function (err, ammoniaUnit) {
    if (err) {
      return next(err);
    } else if (!ammoniaUnit) {
      return res.status(404).send({
        message: 'No ammonia unit with that identifier has been found'
      });
    }
    req.ammoniaUnit = ammoniaUnit;
    next();
  });
};
