'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Unit = mongoose.model('Unit'),
  Lesson = mongoose.model('Lesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an unit
 */
exports.create = function (req, res) {
  var unit = new Unit(req.body);
  unit.user = req.user;

  unit.validate(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      unit.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(unit);
        }
      });
    }
  });
};

/**
 * Show the current unit
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var unit = req.unit ? req.unit.toJSON() : {};

  Lesson.find({ unit: unit }).exec(function(err, lessons) {
    console.log('lessons', lessons);
    unit.hasLessons = (lessons && lessons.length > 0) ? true : false;
    res.json(unit);
  });
};

/**
 * Update an unit
 */
exports.update = function(req, res) {
  var unit = req.unit;

  if (unit) {
    unit = _.extend(unit, req.body);
    if (!unit.updated) unit.updated = [];
    unit.updated.push(Date.now());

    unit.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(unit);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the unit'
    });
  }
};

/**
 * Delete an unit
 */
exports.delete = function (req, res) {
  var unit = req.unit;

  unit.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(unit);
    }
  });
};

/**
 * List of Units
 */
exports.list = function (req, res) {
  Unit.find().sort('title').populate('user', 'displayName').exec(function (err, units) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(units);
    }
  });
};

/**
 * List of lessons by units
 */
exports.listLessons = function(req, res) {
  var unit = req.unit;

  Lesson.find({ unit: unit }).sort('-created').
  populate('user', 'displayName email team profileImageURL').
  populate('unit', 'title color icon').exec(function(err, lessons) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lessons);
    }
  });
};


/**
 * Unit middleware
 */
exports.unitByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Unit is invalid'
    });
  }

  Unit.findById(id).populate('user', 'displayName').exec(function (err, unit) {
    if (err) {
      return next(err);
    } else if (!unit) {
      return res.status(404).send({
        message: 'No unit with that identifier has been found'
      });
    }
    req.unit = unit;
    next();
  });
};
