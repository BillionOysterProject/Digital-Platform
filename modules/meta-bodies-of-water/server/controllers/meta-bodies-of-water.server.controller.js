'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaBodyOfWater = mongoose.model('MetaBodyOfWater'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta bodies of water
 */
exports.create = function(req, res) {
  var bodyOfWater = new MetaBodyOfWater(req.body);
  bodyOfWater.user = req.user;

  bodyOfWater.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bodyOfWater);
    }
  });
};

/**
 * Show the current body of water
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bodyOfWater = req.bodyOfWater ? req.bodyOfWater.toJSON() : {};

  res.json(bodyOfWater);
};

/**
 * Update a body of water
 */
exports.update = function(req, res) {
  var bodyOfWater = req.bodyOfWater;

  bodyOfWater = _.extend(bodyOfWater, req.body);

  bodyOfWater.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bodyOfWater);
    }
  });
};

/**
 * Delete an body of water
 */
exports.delete = function(req, res) {
  var bodyOfWater = req.bodyOfWater;

  bodyOfWater.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bodyOfWater);
    }
  });
};

/**
 * List of bodies of waters
 */
exports.list = function(req, res) {
  MetaBodyOfWater.find().sort('order').exec(function(err, metaBodiesOfWaters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(metaBodiesOfWaters);
    }
  });
};

/**
 * Meta bodies of water middleware
 */
exports.bodyOfWaterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Body of water is invalid'
    });
  }

  MetaBodyOfWater.findById(id).exec(function (err, bodyOfWater) {
    if (err) {
      return next(err);
    } else if (!bodyOfWater) {
      return res.status(404).send({
        message: 'No body of water with that identifier has been found'
      });
    }
    req.bodyOfWater = bodyOfWater;
    next();
  });
};
