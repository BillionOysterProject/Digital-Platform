'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaTrueFalse = mongoose.model('MetaTrueFalse'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta true false
 */
exports.create = function(req, res) {
  var trueFalse = new MetaTrueFalse(req.body);

  trueFalse.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trueFalse);
    }
  });
};

/**
 * Show the current Meta true false
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trueFalse = req.trueFalse ? req.trueFalse.toJSON() : {};

  res.json(trueFalse);
};

/**
 * Update a Meta true false
 */
exports.update = function(req, res) {
  var trueFalse = req.trueFalse;

  if (trueFalse) {
    trueFalse = _.extend(trueFalse, req.body);

    trueFalse.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(trueFalse);
      }
    });
  }
};

/**
 * Delete an Meta true false
 */
exports.delete = function(req, res) {
  var trueFalse = req.trueFalse;

  trueFalse.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trueFalse);
    }
  });
};

/**
 * List of Meta true falses
 */
exports.list = function(req, res) {
  MetaTrueFalse.find().sort('order').exec(function(err, trueFalses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trueFalses);
    }
  });
};

/**
 * Meta true false middleware
 */
exports.trueFalseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'True/false is invalid'
    });
  }

  MetaTrueFalse.findById(id).exec(function (err, trueFalse) {
    if (err) {
      return next(err);
    } else if (!trueFalse) {
      return res.status(404).send({
        message: 'No true/false with that identifier has been found'
      });
    }
    req.trueFalse = trueFalse;
    next();
  });
};
