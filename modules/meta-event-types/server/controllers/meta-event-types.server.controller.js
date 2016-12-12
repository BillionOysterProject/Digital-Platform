'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MetaEventType = mongoose.model('MetaEventType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meta event type
 */
exports.create = function(req, res) {
  var eventType = new MetaEventType(req.body);
  eventType.user = req.user;

  eventType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventType);
    }
  });
};

/**
 * Show the current Meta event type
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var eventType = req.eventType ? req.eventType.toJSON() : {};

  res.jsonp(eventType);
};

/**
 * Update a Meta event type
 */
exports.update = function(req, res) {
  var eventType = req.eventType;

  if (eventType) {
    eventType = _.extend(eventType, req.body);

    eventType.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventType);
      }
    });
  }
};

/**
 * Delete an Meta event type
 */
exports.delete = function(req, res) {
  var eventType = req.eventType;

  eventType.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventType);
    }
  });
};

/**
 * List of Event Types
 */
exports.list = function(req, res) {
  var query;

  var searchRe;
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
      query = MetaEventType.find({ 'type': searchRe });
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }
  } else {
    query = MetaEventType.find();
  }

  query.sort('order').exec(function(err, eventTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventTypes);
    }
  });
};

/**
 * Meta event type middleware
 */
exports.eventTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Event type is invalid'
    });
  }

  MetaEventType.findById(id).exec(function (err, eventType) {
    if (err) {
      return next(err);
    } else if (!eventType) {
      return res.status(404).send({
        message: 'No event type with that identifier has been found'
      });
    }
    req.eventType = eventType;
    next();
  });
};
