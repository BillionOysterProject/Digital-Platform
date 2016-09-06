'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaTurbidityMethod = mongoose.model('MetaTurbidityMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta turbidity method
 */
exports.create = function(req, res) {
  var turbidityMethod = new MetaTurbidityMethod(req.body);

  turbidityMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityMethod);
    }
  });
};

/**
 * Show the current Meta turbidity method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var turbidityMethod = req.turbidityMethod ? req.turbidityMethod.toJSON() : {};

  res.json(turbidityMethod);
};

/**
 * Update a Meta turbidity method
 */
exports.update = function(req, res) {
  var turbidityMethod = req.turbidityMethod;

  if (turbidityMethod) {
    turbidityMethod = _.extend(turbidityMethod, req.body);

    turbidityMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(turbidityMethod);
      }
    });
  }
};

/**
 * Delete an Meta turbidity method
 */
exports.delete = function(req, res) {
  var turbidityMethod = req.turbidityMethod;

  turbidityMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityMethod);
    }
  });
};

/**
 * List of Meta turbidity methods
 */
exports.list = function(req, res) {
  MetaTurbidityMethod.find().sort('order').exec(function(err, turbidityMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(turbidityMethods);
    }
  });
};

/**
 * Meta turbidity method middleware
 */
exports.turbidityMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Turbidity method is invalid'
    });
  }

  MetaTurbidityMethod.findById(id).exec(function (err, turbidityMethod) {
    if (err) {
      return next(err);
    } else if (!turbidityMethod) {
      return res.status(404).send({
        message: 'No turbidity method with that identifier has been found'
      });
    }
    req.turbidityMethod = turbidityMethod;
    next();
  });
};
