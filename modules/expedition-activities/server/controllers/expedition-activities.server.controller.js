'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ExpeditionActivity = mongoose.model('ExpeditionActivity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an expedition activity
 */
exports.create = function (req, res) {
  var activity = new ExpeditionActivity(req.body);
  activity.user = req.user;

  activity.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activity);
    }
  });
};

/**
 * Show the current expedition activity
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var activity = req.activity ? req.activity.toJSON() : {};

  res.json(activity);
};

/**
 * List of Expedition Activities
 */
exports.list = function (req, res) {
  ExpeditionActivity.find()
  .populate('user', 'displayName email profileImageURL')
  .populate('expedition', 'name')
  .sort('-created').exec(function (err, activities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activities);
    }
  });
};

/**
 * Expedition Activity middleware
 */
exports.expeditionActivityByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Activity is invalid'
    });
  }

  ExpeditionActivity.findById(id).exec(function (err, activity) {
    if (err) {
      return next(err);
    } else if (!activity) {
      return res.status(404).send({
        message: 'No activity with that identifier has been found'
      });
    }
    req.activity = activity;
    next();
  });
};
