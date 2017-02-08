'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Research = mongoose.model('Research'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Research
 */
exports.create = function(req, res) {
  var research = new Research(req.body);
  research.user = req.user;

  research.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(research);
    }
  });
};

/**
 * Show the current Research
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var research = req.research ? req.research.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  research.isCurrentUserOwner = req.user && research.user && research.user._id.toString() === req.user._id.toString();

  res.jsonp(research);
};

/**
 * Update a Research
 */
exports.update = function(req, res) {
  var research = req.research;

  research = _.extend(research, req.body);

  research.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(research);
    }
  });
};

/**
 * Delete an Research
 */
exports.delete = function(req, res) {
  var research = req.research;

  research.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(research);
    }
  });
};

/**
 * List of Researches
 */
exports.list = function(req, res) {
  Research.find().sort('-created').populate('user', 'displayName').exec(function(err, researches) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(researches);
    }
  });
};

/**
 * Research middleware
 */
exports.researchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Research is invalid'
    });
  }

  Research.findById(id).populate('user', 'displayName').exec(function (err, research) {
    if (err) {
      return next(err);
    } else if (!research) {
      return res.status(404).send({
        message: 'No Research with that identifier has been found'
      });
    }
    req.research = research;
    next();
  });
};
