'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWaterColor = mongoose.model('MetaWaterColor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a water color
 */
exports.create = function (req, res) {
  var waterColor = new MetaWaterColor(req.body);

  waterColor.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterColor);
    }
  });
};

/**
 * Show the current water color
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var waterColor = req.waterColor ? req.waterColor.toJSON() : {};

  res.json(waterColor);
};

/**
 * Update a water color
 */
exports.update = function (req, res) {
  var waterColor = req.waterColor;

  if (waterColor) {
    waterColor = _.extend(waterColor, req.body);

    waterColor.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterColor);
      }
    });
  }
};

/**
 * Delete a water color
 */
exports.delete = function (req, res) {
  var waterColor = req.waterColor;

  waterColor.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterColor);
    }
  });
};

/**
 * List of Water Colors
 */
exports.list = function (req, res) {
  MetaWaterColor.find().sort('order').exec(function (err, waterColors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterColors);
    }
  });
};

/**
 * Water Colors middleware
 */
exports.waterColorByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Water color is invalid'
    });
  }

  MetaWaterColor.findById(id).exec(function (err, waterColor) {
    if (err) {
      return next(err);
    } else if (!waterColor) {
      return res.status(404).send({
        message: 'No water color with that identifier has been found'
      });
    }
    req.waterColor = waterColor;
    next();
  });
};
