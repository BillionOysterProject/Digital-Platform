'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWaterTemperatureMethod = mongoose.model('MetaWaterTemperatureMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta water temperature method
 */
exports.create = function(req, res) {
  var waterTemperatureMethod = new MetaWaterTemperatureMethod(req.body);

  waterTemperatureMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureMethod);
    }
  });
};

/**
 * Show the current Meta water temperature method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var waterTemperatureMethod = req.waterTemperatureMethod ? req.waterTemperatureMethod.toJSON() : {};

  res.json(waterTemperatureMethod);
};

/**
 * Update a Meta water temperature method
 */
exports.update = function(req, res) {
  var waterTemperatureMethod = req.waterTemperatureMethod;

  if (waterTemperatureMethod) {
    waterTemperatureMethod = _.extend(waterTemperatureMethod, req.body);

    waterTemperatureMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterTemperatureMethod);
      }
    });
  }
};

/**
 * Delete an Meta water temperature method
 */
exports.delete = function(req, res) {
  var waterTemperatureMethod = req.waterTemperatureMethod;

  waterTemperatureMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureMethod);
    }
  });
};

/**
 * List of Meta water temperature methods
 */
exports.list = function(req, res) {
  MetaWaterTemperatureMethod.find().sort('order').exec(function(err, waterTemperatureMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureMethods);
    }
  });
};

/**
 * Meta water temperature method middleware
 */
exports.waterTemperatureMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Water temperature method is invalid'
    });
  }

  MetaWaterTemperatureMethod.findById(id).exec(function (err, waterTemperatureMethod) {
    if (err) {
      return next(err);
    } else if (!waterTemperatureMethod) {
      return res.status(404).send({
        message: 'No water temperature method with that identifier has been found'
      });
    }
    req.waterTemperatureMethod = waterTemperatureMethod;
    next();
  });
};
