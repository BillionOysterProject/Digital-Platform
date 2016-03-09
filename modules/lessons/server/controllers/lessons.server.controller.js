'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Lesson
 */
exports.create = function(req, res) {
  var lesson = new Lesson(req.body);
  lesson.user = req.user;
  if (req.files && req.files.handoutFile) {
    lesson.attach('handout', req.files.handoutFile, function(error) {
      if (error) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(error)
        });
      } else {
        lesson.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(lesson);
          }
        });
      }
    });
  } else {
    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lesson);
      }
    });
  }
};

/**
 * Show the current lesson
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var lesson = req.lesson ? req.lesson.toJSON() : {};

  // Add a custom field to the Lesson, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Lesson model.
  lesson.isCurrentUserOwner = req.user && lesson.user && lesson.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(lesson);
};

/**
 * Update a lesson
 */
exports.update = function(req, res) {
  var lesson = req.lesson;

  if (lesson) {
    lesson = _.extend(lesson, req.body);
    if (!lesson.updated) lesson.updated = [];
    lesson.updated.push(Date.now());

    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lesson);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the lesson'
    });
  }
};

/** 
 * Delete a lesson
 */
exports.delete = function(req, res) {
  var lesson = req.lesson;

  lesson.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/** 
 * List of lessons
 */
exports.list = function(req, res) {
  Lesson.find().sort('-created').populate('user', 'displayName').exec(function(err, lessons) {
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
 * Upload files to lessons
 */
exports.uploadFeaturedImage = function (req, res) {
  var lesson = req.lesson;
  var upload = multer(config.uploads.lessonFeaturedImageUpload).single('newFeaturedImage');
  var featuredImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = featuredImageUploadFileFilter;

  if (lesson) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading featured image picture'
        });
      } else {
        lesson.featuredImage = config.uploads.lessonFeaturedImageUpload.dest + req.file.filename;

        lesson.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.json(lesson);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'Lesson does not exist'
    });
  }
};

/**
 * Lesson middleware
 */
exports.lessonByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lesson is invalid'
    });
  }

  Lesson.findById(id).populate('user', 'displayName email team profileImageURL').populate('unit', 'title color icon').exec(function(err, lesson) {
    if (err) {
      return next(err);
    } else if (!lesson) {
      return res.status(404).send({
        message: 'No lesson with that identifier has been found'
      });
    }
    req.lesson = lesson;
    next();
  });
};