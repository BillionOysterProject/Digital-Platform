'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaPropertyOwner = mongoose.model('MetaPropertyOwner'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta property owner
 */
exports.create = function(req, res) {
  var propertyOwner = new MetaPropertyOwner(req.body);

  propertyOwner.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(propertyOwner);
    }
  });
};

/**
 * Show the current Meta property owner
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var propertyOwner = req.propertyOwner ? req.propertyOwner.toJSON() : {};

  res.json(propertyOwner);
};

/**
 * Update a Meta property owner
 */
exports.update = function(req, res) {
  var propertyOwner = req.propertyOwner;

  if (propertyOwner) {
    propertyOwner = _.extend(propertyOwner, req.body);

    propertyOwner.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(propertyOwner);
      }
    });
  }
};

/**
 * Delete an Meta property owner
 */
exports.delete = function(req, res) {
  var propertyOwner = req.propertyOwner;

  propertyOwner.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(propertyOwner);
    }
  });
};

/**
 * List of Meta property owners
 */
exports.list = function(req, res) {
  MetaPropertyOwner.find().sort('name').exec(function(err, propertyOwners) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(propertyOwners);
    }
  });
};

/**
 * Meta property owner middleware
 */
exports.propertyOwnerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Property owner is invalid'
    });
  }

  MetaPropertyOwner.findById(id).exec(function (err, propertyOwner) {
    if (err) {
      return next(err);
    } else if (!propertyOwner) {
      return res.status(404).send({
        message: 'No property owner with that identifier has been found'
      });
    }
    req.propertyOwner = propertyOwner;
    next();
  });
};
