'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaDissolvedOxygenMethod = mongoose.model('MetaDissolvedOxygenMethod'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta dissolved oxygen method
 */
exports.create = function(req, res) {
  var dissolvedOxygenMethod = new MetaDissolvedOxygenMethod(req.body);

  dissolvedOxygenMethod.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenMethod);
    }
  });
};

/**
 * Show the current Meta dissolved oxygen method
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dissolvedOxygenMethod = req.dissolvedOxygenMethod ? req.dissolvedOxygenMethod.toJSON() : {};

  res.json(dissolvedOxygenMethod);
};

/**
 * Update a Meta dissolved oxygen method
 */
exports.update = function(req, res) {
  var dissolvedOxygenMethod = req.dissolvedOxygenMethod;

  if (dissolvedOxygenMethod) {
    dissolvedOxygenMethod = _.extend(dissolvedOxygenMethod, req.body);

    dissolvedOxygenMethod.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(dissolvedOxygenMethod);
      }
    });
  }
};

/**
 * Delete an Meta dissolved oxygen method
 */
exports.delete = function(req, res) {
  var dissolvedOxygenMethod = req.dissolvedOxygenMethod;

  dissolvedOxygenMethod.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenMethod);
    }
  });
};

/**
 * List of Meta dissolved oxygen methods
 */
exports.list = function(req, res) {
  MetaDissolvedOxygenMethod.find().sort('order').exec(function(err, dissolvedOxygenMethods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dissolvedOxygenMethods);
    }
  });
};

/**
 * Meta dissolved oxygen method middleware
 */
exports.dissolvedOxygenMethodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dissolved oxygen method is invalid'
    });
  }

  MetaDissolvedOxygenMethod.findById(id).exec(function (err, dissolvedOxygenMethod) {
    if (err) {
      return next(err);
    } else if (!dissolvedOxygenMethod) {
      return res.status(404).send({
        message: 'No dissolved oxygen method with that identifier has been found'
      });
    }
    req.dissolvedOxygenMethod = dissolvedOxygenMethod;
    next();
  });
};
