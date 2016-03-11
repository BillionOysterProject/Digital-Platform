'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaShorelineType = mongoose.model('MetaShorelineType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a shoreline type
 */
exports.create = function (req, res) {
  var shorelineType = new MetaShorelineType(req.body);

  shorelineType.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shorelineType);
    }
  });
};

/**
 * Show the current shoreline type
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var shorelineType = req.shorelineType ? req.shorelineType.toJSON() : {};

  res.json(shorelineType);
};

/**
 * Update a shoreline type
 */
exports.update = function (req, res) {
  var shorelineType = req.shorelineType;

  if (shorelineType) {
    shorelineType = _.extend(shorelineType, req.body);

    shorelineType.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(shorelineType);
      }
    });
  }
};

/**
 * Delete a shoreline type
 */
exports.delete = function (req, res) {
  var shorelineType = req.shorelineType;

  shorelineType.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shorelineType);
    }
  });
};

/**
 * List of Shoreline Types
 */
exports.list = function (req, res) {
  MetaShorelineType.find().sort('order').exec(function (err, shorelineTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shorelineTypes);
    }
  });
};

/**
 * Shoreline Types middleware
 */
exports.shorelineTypeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shoreline type is invalid'
    });
  }

  MetaShorelineType.findById(id).exec(function (err, shorelineType) {
    if (err) {
      return next(err);
    } else if (!shorelineType) {
      return res.status(404).send({
        message: 'No shoreline type with that identifier has been found'
      });
    }
    req.shorelineType = shorelineType;
    next();
  });
};
