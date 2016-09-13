'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaSalinityMethod = mongoose.model('MetaSalinityMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta salinity method
 */
exports.create = function(req, res) {
  var salinityMethod = new MetaSalinityMethod(req.body);

  salinityMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityMethod);
    }
  });
};

/**
 * Show the current Meta salinity method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var salinityMethod = req.salinityMethod ? req.salinityMethod.toJSON() : {};

  res.json(salinityMethod);
};

/**
 * Update a Meta salinity method
 */
exports.update = function(req, res) {
  var salinityMethod = req.salinityMethod;

  if (salinityMethod) {
    salinityMethod = _.extend(salinityMethod, req.body);

    salinityMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(salinityMethod);
      }
    });
  }
};

/**
 * Delete an Meta salinity method
 */
exports.delete = function(req, res) {
  var salinityMethod = req.salinityMethod;

  salinityMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityMethod);
    }
  });
};

/**
 * List of Meta salinity methods
 */
exports.list = function(req, res) {
  MetaSalinityMethod.find().sort('order').exec(function(err, salinityMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(salinityMethods);
    }
  });
};

/**
 * Meta salinity method middleware
 */
exports.salinityMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Salinity method is invalid'
    });
  }

  MetaSalinityMethod.findById(id).exec(function (err, salinityMethod) {
    if (err) {
      return next(err);
    } else if (!salinityMethod) {
      return res.status(404).send({
        message: 'No salinity method with that identifier has been found'
      });
    }
    req.salinityMethod = salinityMethod;
    next();
  });
};
