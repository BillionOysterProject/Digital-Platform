'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaNycssUnit = mongoose.model('MetaNycssUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a standard
 */
exports.create = function (req, res) {
  var standard = new MetaNycssUnit(req.body);

  standard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * Show the current standard
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var standard = req.standard ? req.standard.toJSON() : {};

  res.json(standard);
};

/**
 * Update a standard type
 */
exports.update = function (req, res) {
  var standard = req.standard;

  if (standard) {
    standard = _.extend(standard, req.body);

    standard.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(standard);
      }
    });
  }
};

/**
 * Delete a standard type
 */
exports.delete = function (req, res) {
  var standard = req.standard;

  standard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * List of Standards
 */
exports.list = function (req, res) {
  MetaNycssUnit.find().sort('order').exec(function (err, standards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standards);
    }
  });
};

/**
 * Standards middleware
 */
exports.standardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Standard is invalid'
    });
  }

  MetaNycssUnit.findById(id).exec(function (err, standard) {
    if (err) {
      return next(err);
    } else if (!standard) {
      return res.status(404).send({
        message: 'No standard with that identifier has been found'
      });
    }
    req.standard = standard;
    next();
  });
};
