'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWaterTemperatureUnit = mongoose.model('MetaWaterTemperatureUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta water temperature unit
 */
exports.create = function(req, res) {
  var waterTemperatureUnit = new MetaWaterTemperatureUnit(req.body);

  waterTemperatureUnit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureUnit);
    }
  });
};

/**
 * Show the current Meta water temperature unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var waterTemperatureUnit = req.waterTemperatureUnit ? req.waterTemperatureUnit.toJSON() : {};

  res.json(waterTemperatureUnit);
};

/**
 * Update a Meta water temperature unit
 */
exports.update = function(req, res) {
  var waterTemperatureUnit = req.waterTemperatureUnit;

  if (waterTemperatureUnit) {
    waterTemperatureUnit = _.extend(waterTemperatureUnit, req.body);

    waterTemperatureUnit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterTemperatureUnit);
      }
    });
  }
};

/**
 * Delete an Meta water temperature unit
 */
exports.delete = function(req, res) {
  var waterTemperatureUnit = req.waterTemperatureUnit;

  waterTemperatureUnit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureUnit);
    }
  });
};

/**
 * List of Meta water temperature units
 */
exports.list = function(req, res) {
  MetaWaterTemperatureUnit.find().sort('order').exec(function(err, waterTemperatureUnits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterTemperatureUnits);
    }
  });
};

/**
 * Meta water temperature unit middleware
 */
exports.waterTemperatureUnitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Water temperature unit is invalid'
    });
  }

  MetaWaterTemperatureUnit.findById(id).exec(function (err, waterTemperatureUnit) {
    if (err) {
      return next(err);
    } else if (!waterTemperatureUnit) {
      return res.status(404).send({
        message: 'No water temperature unit with that identifier has been found'
      });
    }
    req.waterTemperatureUnit = waterTemperatureUnit;
    next();
  });
};
