'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaAmmoniaMethod = mongoose.model('MetaAmmoniaMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta ammonia method
 */
exports.create = function(req, res) {
  var ammoniaMethod = new MetaAmmoniaMethod(req.body);

  ammoniaMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaMethod);
    }
  });
};

/**
 * Show the current Meta ammonia method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ammoniaMethod = req.ammoniaMethod ? req.ammoniaMethod.toJSON() : {};

  res.json(ammoniaMethod);
};

/**
 * Update a Meta ammonia method
 */
exports.update = function(req, res) {
  var ammoniaMethod = req.ammoniaMethod;

  if (ammoniaMethod) {
    ammoniaMethod = _.extend(ammoniaMethod, req.body);

    ammoniaMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(ammoniaMethod);
      }
    });
  }
};

/**
 * Delete an Meta ammonia method
 */
exports.delete = function(req, res) {
  var ammoniaMethod = req.ammoniaMethod;

  ammoniaMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaMethod);
    }
  });
};

/**
 * List of Meta ammonia methods
 */
exports.list = function(req, res) {
  MetaAmmoniaMethod.find().sort('order').exec(function(err, ammoniaMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ammoniaMethods);
    }
  });
};

/**
 * Meta ammonia method middleware
 */
exports.ammoniaMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ammonia method is invalid'
    });
  }

  MetaAmmoniaMethod.findById(id).exec(function (err, ammoniaMethod) {
    if (err) {
      return next(err);
    } else if (!ammoniaMethod) {
      return res.status(404).send({
        message: 'No ammonia method with that identifier has been found'
      });
    }
    req.ammoniaMethod = ammoniaMethod;
    next();
  });
};
