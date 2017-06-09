'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Unit = mongoose.model('Unit'),
  UnitActivity = mongoose.model('UnitActivity'),
  Lesson = mongoose.model('Lesson'),
  LessonTracker = mongoose.model('LessonTracker'),
  User = mongoose.model('User'),
  SubjectArea = mongoose.model('MetaSubjectArea'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  _ = require('lodash');

var validateUnit = function(unit, successCallback, errorCallback) {
  var errorMessages = [];

  if (!unit.title) {
    errorMessages.push('Title is required');
  }
  if (!unit.color) {
    errorMessages.push('Color is required');
  }
  if (!unit.icon) {
    errorMessages.push('Icon is required');
  }

  if (!unit.stageOne || !unit.stageOne.enduringUnderstandings || !unit.stageOne.enduringUnderstandings.fieldWork) {
    errorMessages.push('Field work is required');
  }
  if (!unit.stageOne || !unit.stageOne.enduringUnderstandings || !unit.stageOne.enduringUnderstandings.scienceContent) {
    errorMessages.push('Science content is required');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(unit);
  }
};

/**
 * Create an unit
 */
exports.create = function (req, res) {
  validateUnit(req.body,
  function(unitJSON) {
    var unit = new Unit(unitJSON);
    unit.user = req.user;
    unit.status = 'published';

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
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

/**
 * Show the current unit
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  // var unit = req.unit ? req.unit.toJSON() : {};
  var unit = req.unit;

  unit.isCurrentUserOwner = req.user && unit.user && unit.user._id.toString() === req.user._id.toString() ? true : false;

  Lesson.find({ unit: unit }).exec(function(err, lessons) {
    unit.hasLessons = (lessons && lessons.length > 0) ? true : false;

    if (!unit.isCurrentUserOwner) {
      var activity = new UnitActivity({
        user: req.user,
        unit: unit,
        activity: 'viewed'
      });

      activity.save(function(err) {
        res.json(unit);
      });
    } else {
      res.json(unit);
    }
  });
};

/**
 * Incrementally save a unit
 */
exports.incrementalSave = function(req, res) {
  console.log('incrementalSave');
  var unit = req.unit;

  if (unit) {
    unit = _.extend(unit, req.body);
    if (!req.body.initial) unit.status = 'draft';
  } else {
    unit = new Unit(req.body);
    unit.user = req.user;
    unit.status = 'draft';
  }

  unit.save(function(err) {
    if (err) {
      console.log('save err', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      validateUnit(unit,
      function(unitJSON) {
        res.json({
          unit: unit,
          successful: true
        });
      }, function(errorMessages) {
        res.json({
          unit: unit,
          errors: errorMessages
        });
      });
    }
  });
};

/**
 * Update an unit
 */
exports.update = function(req, res) {
  var unit = req.unit;
  validateUnit(req.body,
  function(unitJSON) {
    if (unit) {
      unit = _.extend(unit, unitJSON);
      if (!unit.updated) unit.updated = [];
      unit.updated.push(Date.now());
      unit.status = 'published';

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
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
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
  var query;

  if (req.query.publishedStatus === 'published') {
    query = Unit.find({ status: 'published' });
  } else if (req.query.publishedStatus === 'drafts') {
    query = Unit.find({ status: 'draft' });
  } else {
    query = Unit.find();
  }

  query.sort('title').populate('user', 'displayName').exec(function (err, units) {
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
  populate('user', 'firstName displayName email team profileImageURL username').
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

  var query = Unit.findById(id).populate('user', 'firstName displayName email team profileImageURL username');
  if (req.query.full) {
    query.populate('standards.nycsssUnits', 'header description')
    .populate('standards.nysssKeyIdeas', 'header description')
    .populate('standards.nysssMajorUnderstandings', 'code description')
    .populate('standards.nysssMst', 'code description')
    .populate('standards.ngssDisciplinaryCoreIdeas', 'header description')
    .populate('standards.ngssScienceEngineeringPractices', 'header description')
    .populate('standards.ngssCrossCuttingConcepts', 'header description')
    .populate('standards.cclsMathematics', 'code description')
    .populate('standards.cclsElaScienceTechnicalSubjects', 'code description')
    .populate('lessons', 'title lessonOverview lessonObjectives user')
    .populate('parentUnits', 'title')
    .populate('subUnits', 'title lessons subUnits');
  }

  query.exec(function (err, unit) {
    if (err) {
      return next(err);
    } else if (!unit && id !== '000000000000000000000000') {
      return res.status(404).send({
        message: 'No unit with that identifier has been found'
      });
    }
    if(req.query.full) {
      var unitJSON = unit ? unit.toJSON() : {};
      async.forEach(unitJSON.lessons, function(lesson, lessonCallback) {
        LessonTracker.find({ lesson: lesson._id }).distinct('user', function(err2, teamLeads) {
          lesson.stats = {
            teamLeadCount: (teamLeads) ? teamLeads.length : 0
          };
          SubjectArea.populate(lesson, { path: 'lessonOverview.subjectAreas' }, function(err, output) {
            User.populate(lesson, { path: 'user', select: 'profileImageURL displayName' }, function(err, output) {
              console.log('output', output);
              lessonCallback();
            });
          });
        });
      }, function(lessonErr) {
        async.forEach(unitJSON.parentUnits, function(parent, parentCallback) {
          parentCallback();
        }, function(parentErr) {
          async.forEach(unitJSON.subUnits, function(child, childCallback) {
            childCallback();
          }, function(childErr) {
            req.unit = unitJSON;
            next();
          });
        });
      });
    } else {
      req.unit = unit;
      next();
    }
  });
};
