'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaPhMethod = mongoose.model('MetaPhMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta ph method
 */
exports.create = function(req, res) {
  var phMethod = new MetaPhMethod(req.body);

  phMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phMethod);
    }
  });
};

/**
 * Show the current Meta ph method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var phMethod = req.phMethod ? req.phMethod.toJSON() : {};

  res.json(phMethod);
};

/**
 * Update a Meta ph method
 */
exports.update = function(req, res) {
  var phMethod = req.phMethod;

  if(phMethod) {
    phMethod = _.extend(phMethod, req.body);

    phMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(phMethod);
      }
    });
  }
};

/**
 * Delete an Meta ph method
 */
exports.delete = function(req, res) {
  var phMethod = req.phMethod;

  phMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phMethod);
    }
  });
};

/**
 * List of Meta ph methods
 */
exports.list = function(req, res) {
  MetaPhMethod.find().sort('order').exec(function(err, phMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(phMethods);
    }
  });
};

/**
 * Meta ph method middleware
 */
exports.phMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'pH method is invalid'
    });
  }

  MetaPhMethod.findById(id).exec(function (err, phMethod) {
    if (err) {
      return next(err);
    } else if (!phMethod) {
      return res.status(404).send({
        message: 'No pH method with that identifier has been found'
      });
    }
    req.phMethod = phMethod;
    next();
  });
};
