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

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(unit);
  }
};

var checkRole = function(user, role) {
  var roleIndex = _.findIndex(user.roles, function(o) {
    return o === role;
  });
  return (roleIndex > -1) ? true : false;
};

var onlyShowStatus = function(array, status) {
  var hidden = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].status === status) {
      hidden.push(array[i]);
    }
  }
  return hidden;
};

var addUnitToUnits = function(unit, callback) {
  async.forEach(unit.parentUnits, function(parent, unitCallback) {
    Unit.findOne({ _id: parent }).exec(function(err, unitObj) {
      if (err) {
        unitCallback();
      } else if (unitObj) {
        var index = _.findIndex(unitObj.subUnits, function(s) {
          if (s && unit && unit._id) {
            return s.toString() === unit._id.toString();
          } else {
            return false;
          }
        });
        if (index === -1) {
          unitObj.subUnits.push(unit);
          unitObj.save(function(err) {
            unitCallback();
          });
        } else {
          unitCallback();
        }
      } else {
        unitCallback();
      }
    });
  }, function(err) {
    callback();
  });
};

var removeUnitFromUnits = function(unit, callback) {
  async.forEach(unit.parentUnits, function(parent, unitCallback) {
    Unit.findOne({ _id: unit }).exec(function(err, unitObj) {
      if (err) {
        unitCallback();
      } else if (unitObj) {
        var index = _.findIndex(unitObj.subUnits, function(s) {
          if (s && unit && unit._id) {
            return s.toString() === unit._id.toString();
          } else {
            return false;
          }
        });
        if (index > -1) {
          unitObj.subUnits.splice(index, 1);
          unitObj.save(function(err) {
            unitCallback();
          });
        } else {
          unitCallback();
        }
      } else {
        unitCallback();
      }
    });
  }, function(err) {
    callback();
  });
};

/**
 * Create an unit
 */
exports.create = function (req, res) {
  validateUnit(req.body,
  function(unitJSON) {
    var unit = new Unit(unitJSON);
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
            addUnitToUnits(unit, function() {
              res.json(unit);
            });
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

      unit.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          removeUnitFromUnits(req.unit, function() {
            addUnitToUnits(unit, function() {
              res.json(unit);
            });
          });
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
 * Update an unit's lessons
 */
exports.updateLessons = function(req, res) {
  var unit = req.unit;
  if (unit) {
    unit.lessons = req.body.lessons;

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
      message: 'Could not update unit'
    });
  }
};

/**
 * Update an unit's sub units
 */
exports.updateSubUnits = function(req, res) {
  var unit = req.unit;
  if (unit) {
    unit.subUnits = req.body.subUnits;

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
      message: 'Could not update unit'
    });
  }
};

/**
 * Delete an unit
 */
exports.delete = function (req, res) {
  var unit = req.unit;

  removeUnitFromUnits(unit, function() {
    unit.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(unit);
      }
    });
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

  query.sort('title').populate('user', 'displayName')
  .populate('parentUnits', 'title icon color status')
  .populate('lessons', 'title status')
  .populate('subUnits', 'title status')
  .exec(function (err, units) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < units.length; i++) {
        units[i].parentUnits = onlyShowStatus(units[i].parentUnits, 'published');
        if (!checkRole(req.user, 'admin')) {
          units[i].lessons = onlyShowStatus(units[i].lessons, 'published');
          units[i].subUnits = onlyShowStatus(units[i].subUnits, 'published');
        }
      }
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
    query.populate('standards.cclsElaScienceTechnicalSubjects')
    .populate('standards.cclsMathematics')
    .populate('standards.ngssCrossCuttingConcepts')
    .populate('standards.ngssDisciplinaryCoreIdeas')
    .populate('standards.ngssScienceEngineeringPractices')
    .populate('standards.nycsssUnits')
    .populate('standards.nysssKeyIdeas')
    .populate('standards.nysssMajorUnderstandings')
    .populate('standards.nysssMst')
    .populate('lessons', 'title lessonOverview lessonObjectives user featuredImage status')
    .populate('parentUnits', 'title color icon status')
    .populate('subUnits', 'title lessons subUnits status');
  } else {
    query.populate('parentUnits', 'title');
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
      unitJSON.parentUnits = onlyShowStatus(unitJSON.parentUnits, 'published');
      if (!checkRole(req.user, 'admin')) {
        unitJSON.lessons = onlyShowStatus(unitJSON.lessons, 'published');
        unitJSON.subUnits = onlyShowStatus(unitJSON.subUnits, 'published');
      }

      async.forEach(unitJSON.lessons, function(lesson, lessonCallback) {
        LessonTracker.find({ lesson: lesson._id }).distinct('user', function(err2, teamLeads) {
          lesson.stats = {
            teamLeadCount: (teamLeads) ? teamLeads.length : 0
          };
          SubjectArea.populate(lesson, { path: 'lessonOverview.subjectAreas' }, function(err, output) {
            User.populate(lesson, { path: 'user', select: 'profileImageURL displayName' }, function(err, output) {
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
