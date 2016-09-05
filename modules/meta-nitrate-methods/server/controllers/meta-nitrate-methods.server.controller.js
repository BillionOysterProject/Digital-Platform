'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaNitrateMethod = mongoose.model('MetaNitrateMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta nitrates method
 */
exports.create = function(req, res) {
  var nitrateMethod = new MetaNitrateMethod(req.body);

  nitrateMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateMethod);
    }
  });
};

/**
 * Show the current Meta nitrates method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var nitrateMethod = req.nitrateMethod ? req.nitrateMethod.toJSON() : {};

  res.json(nitrateMethod);
};

/**
 * Update a Meta nitrates method
 */
exports.update = function(req, res) {
  var nitrateMethod = req.nitrateMethod;

  if (nitrateMethod) {
    nitrateMethod = _.extend(nitrateMethod, req.body);

    nitrateMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(nitrateMethod);
      }
    });
  }
};

/**
 * Delete an Meta nitrates method
 */
exports.delete = function(req, res) {
  var nitrateMethod = req.nitrateMethod;

  nitrateMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateMethod);
    }
  });
};

/**
 * List of Meta nitrates methods
 */
exports.list = function(req, res) {
  MetaNitrateMethod.find().sort('order').exec(function(err, nitrateMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(nitrateMethods);
    }
  });
};

/**
 * Meta nitrates method middleware
 */
exports.nitrateMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Nitrates method is invalid'
    });
  }

  MetaNitrateMethod.findById(id).exec(function (err, nitrateMethod) {
    if (err) {
      return next(err);
    } else if (!nitrateMethod) {
      return res.status(404).send({
        message: 'No nitrates method with that identifier has been found'
      });
    }
    req.nitrateMethod = nitrateMethod;
    next();
  });
};
