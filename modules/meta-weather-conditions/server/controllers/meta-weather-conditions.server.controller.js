'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWeatherCondition = mongoose.model('MetaWeatherCondition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a weather condition
 */
exports.create = function (req, res) {
  var weatherCondition = new MetaWeatherCondition(req.body);

  weatherCondition.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(weatherCondition);
    }
  });
};

/**
 * Show the current weather condition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var weatherCondition = req.weatherCondition ? req.weatherCondition.toJSON() : {};

  res.json(weatherCondition);
};

/**
 * Update a weather condition
 */
exports.update = function (req, res) {
  var weatherCondition = req.weatherCondition;

  if (weatherCondition) {
    weatherCondition = _.extend(weatherCondition, req.body);

    weatherCondition.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(weatherCondition);
      }
    });
  }
};

/**
 * Delete a weather condition
 */
exports.delete = function (req, res) {
  var weatherCondition = req.weatherCondition;

  weatherCondition.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(weatherCondition);
    }
  });
};

/**
 * List of Weather Conditions
 */
exports.list = function (req, res) {
  MetaWeatherCondition.find().sort('order').exec(function (err, weatherConditions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(weatherConditions);
    }
  });
};

/**
 * Weather Conditions middleware
 */
exports.weatherConditionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Weather condition is invalid'
    });
  }

  MetaWeatherCondition.findById(id).exec(function (err, weatherCondition) {
    if (err) {
      return next(err);
    } else if (!weatherCondition) {
      return res.status(404).send({
        message: 'No weather condition with that identifier has been found'
      });
    }
    req.weatherCondition = weatherCondition;
    next();
  });
};
