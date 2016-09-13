'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaGarbageExtent = mongoose.model('MetaGarbageExtent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta garbage extent
 */
exports.create = function(req, res) {
  var garbageExtent = new MetaGarbageExtent(req.body);

  garbageExtent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garbageExtent);
    }
  });
};

/**
 * Show the current Meta garbage extent
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var garbageExtent = req.garbageExtent ? req.garbageExtent.toJSON() : {};

  res.jsonp(garbageExtent);
};

/**
 * Update a Meta garbage extent
 */
exports.update = function(req, res) {
  var garbageExtent = req.garbageExtent;

  if (garbageExtent) {
    garbageExtent = _.extend(garbageExtent, req.body);

    garbageExtent.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(garbageExtent);
      }
    });
  }
};

/**
 * Delete an Meta garbage extent
 */
exports.delete = function(req, res) {
  var garbageExtent = req.garbageExtent;

  garbageExtent.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(garbageExtent);
    }
  });
};

/**
 * List of Meta garbage extents
 */
exports.list = function(req, res) {
  MetaGarbageExtent.find().sort('order').exec(function(err, garbageExtents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(garbageExtents);
    }
  });
};

/**
 * Meta garbage extent middleware
 */
exports.garbageExtentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Garbage extent is invalid'
    });
  }

  MetaGarbageExtent.findById(id).exec(function (err, garbageExtent) {
    if (err) {
      return next(err);
    } else if (!garbageExtent) {
      return res.status(404).send({
        message: 'No garbage extent with that identifier has been found'
      });
    }
    req.garbageExtent = garbageExtent;
    next();
  });
};
