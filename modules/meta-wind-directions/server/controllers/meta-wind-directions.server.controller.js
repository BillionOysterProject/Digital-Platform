'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWindDirection = mongoose.model('MetaWindDirection'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta wind direction
 */
exports.create = function(req, res) {
  var windDirection = new MetaWindDirection(req.body);

  windDirection.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(windDirection);
    }
  });
};

/**
 * Show the current Meta wind direction
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var windDirection = req.windDirection ? req.windDirection.toJSON() : {};

  res.json(windDirection);
};

/**
 * Update a Meta wind direction
 */
exports.update = function(req, res) {
  var windDirection = req.windDirection;

  if (windDirection) {
    windDirection = _.extend(windDirection, req.body);

    windDirection.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(windDirection);
      }
    });
  }
};

/**
 * Delete an Meta wind direction
 */
exports.delete = function(req, res) {
  var windDirection = req.windDirection;

  windDirection.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(windDirection);
    }
  });
};

/**
 * List of Meta wind directions
 */
exports.list = function(req, res) {
  MetaWindDirection.find().sort('order').exec(function(err, windDirections) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(windDirections);
    }
  });
};

/**
 * Meta wind direction middleware
 */
exports.windDirectionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Wind direction is invalid'
    });
  }

  MetaWindDirection.findById(id).exec(function (err, windDirection) {
    if (err) {
      return next(err);
    } else if (!windDirection) {
      return res.status(404).send({
        message: 'No wind direction with that identifier has been found'
      });
    }
    req.windDirection = windDirection;
    next();
  });
};
