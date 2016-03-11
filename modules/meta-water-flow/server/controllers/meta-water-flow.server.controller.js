'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaWaterFlow = mongoose.model('MetaWaterFlow'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a water flow
 */
exports.create = function (req, res) {
  var waterFlow = new MetaWaterFlow(req.body);

  waterFlow.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterFlow);
    }
  });
};

/**
 * Show the current water flow
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var waterFlow = req.waterFlow ? req.waterFlow.toJSON() : {};

  res.json(waterFlow);
};

/**
 * Update a water flow
 */
exports.update = function (req, res) {
  var waterFlow = req.waterFlow;

  if (waterFlow) {
    waterFlow = _.extend(waterFlow, req.body);

    waterFlow.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(waterFlow);
      }
    });
  }
};

/**
 * Delete a water flow
 */
exports.delete = function (req, res) {
  var waterFlow = req.waterFlow;

  waterFlow.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterFlow);
    }
  });
};

/**
 * List of Water Flows
 */
exports.list = function (req, res) {
  MetaWaterFlow.find().sort('order').exec(function (err, waterFlows) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(waterFlows);
    }
  });
};

/**
 * Water Flows middleware
 */
exports.waterFlowByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Water flow is invalid'
    });
  }

  MetaWaterFlow.findById(id).exec(function (err, waterFlow) {
    if (err) {
      return next(err);
    } else if (!waterFlow) {
      return res.status(404).send({
        message: 'No water flow with that identifier has been found'
      });
    }
    req.waterFlow = waterFlow;
    next();
  });
};
