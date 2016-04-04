'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  request = require('request'),
  path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Lesson
 */
exports.create = function(req, res) {
  var lesson = new Lesson(req.body);

  lesson.user = req.user;
  lesson.materialsResources.handoutsFileInput = [];
  lesson.materialsResources.teacherResourcesFiles = [];
  lesson.materialsResources.stateTestQuestions = [];

  lesson.save(function(err) {
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
    console.log('body', req.body);

    var existingHandouts = [];
    for (var i = 0; i < lesson.materialsResources.handoutsFileInput.length; i++) {
      var handout = lesson.materialsResources.handoutsFileInput[i];
      if (handout.path) {
        existingHandouts.push(handout);
      }
    }
    lesson.materialsResources.handoutsFileInput = existingHandouts;

    var existingResources = [];
    for (var j = 0; j < lesson.materialsResources.teacherResourcesFiles.length; j++) {
      var resource = lesson.materialsResources.teacherResourcesFiles[j];
      if (resource.path) {
        existingResources.push(resource);
      }
    }
    lesson.materialsResources.teacherResourcesFiles = existingResources;

    var existingQuestions = [];
    for (var k = 0; k < lesson.materialsResources.stateTestQuestions.length; k++) {
      var question = lesson.materialsResources.stateTestQuestions[k];
      if (question.path) {
        existingQuestions.push(question);
      }
    }
    lesson.materialsResources.stateTestQuestions = existingQuestions;

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
var deleteInternal = function(lesson, successCallback, errorCallback) {
  var filesToDelete = [];
  if (lesson) {
    if (lesson.featuredImage && lesson.featuredImage.path) {
      filesToDelete.push(lesson.featuredImage.path);
    }
    if (lesson.materialsResources) {
      if (lesson.materialsResources.teacherResourcesFiles && lesson.materialsResources.teacherResourcesFiles.path) {
        filesToDelete.push(lesson.materialsResources.teacherResourcesFiles.path);
      }
      if (lesson.materialsResources.handoutsFileInput && lesson.materialsResources.handoutsFileInput.path) {
        filesToDelete.push(lesson.materialsResources.handoutsFileInput.path);
      }
      if (lesson.materialsResources.stateTestQuestions && lesson.materialsResources.stateTestQuestions.path) {
        filesToDelete.push(lesson.materialsResources.stateTestQuestions.path);
      }
    }
  }

  var uploadRemote = new UploadRemote();
  uploadRemote.deleteRemote(filesToDelete,
  function() {
    lesson.remove(function(err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(lesson);
      }
    });
  }, function(err) {
    errorCallback(err);
  });
};

exports.delete = function(req, res) {
  var lesson = req.lesson;

  deleteInternal(lesson,
  function(lesson) {
    res.json(lesson);
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

/**
 * List of lessons
 */
exports.list = function(req, res) {
  var query;
  var and = [];

  if (req.query.subjectArea) {
    and.push({ 'lessonOverview.subjectAreas' : req.query.subjectArea });
  }

  if (req.query.setting) {
    and.push({ 'lessonOverview.setting' : req.query.setting });
  }

  if (req.query.unit) {
    and.push({ 'unit': req.query.unit });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    searchRe = new RegExp(req.query.searchString, 'i');
    or.push({ 'title': searchRe });
    or.push({ 'lessonOverview.lessonSummary': searchRe });
    or.push({ 'lessonObjectives': searchRe });
    or.push({ 'materialsResources.vocabulary': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = Lesson.find(and[0]);
  } else if (and.length > 0) {
    query = Lesson.find({ $and: and });
  } else {
    query = Lesson.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'owner') {
      query.sort({ 'user': 1 });
    }
  } else {
    query.sort('-create');
  }

  if (req.query.limit) {
    if (req.query.page) {
      var limit = Number(req.query.limit);
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    }
  } else {
    var limit2 = Number(req.query.limit);
    query.limit(limit2);
  }

  query.populate('user', 'displayName email team profileImageURL').populate('unit', 'title color icon')
  .exec(function(err, lessons) {
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

var uploadFileSuccess = function(lesson, res) {
  lesson.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(lesson);
    }
  });
};

var uploadFileError = function(lesson, errorMessage, res) {
  console.log('errorMessage', errorMessage);
  deleteInternal(lesson,
  function(lesson) {
    return res.status(400).send({
      message: errorMessage
    });
  }, function(err) {
    return res.status(400).send({
      message: err
    });
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
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.lessonFeaturedImageUpload,
    function(fileInfo) {
      lesson.featuredImage = fileInfo;

      uploadFileSuccess(lesson, res);
    }, function (errorMessage) {
      uploadFileError(lesson, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Lesson does not exist'
    });
  }
};

exports.uploadHandouts = function (req, res) {
  var lesson = req.lesson;
  var upload = multer(config.uploads.lessonHandoutsUpload).single('newHandouts', 20);

  var handoutUploadFileFilter = require(path.resolve('./config/lib/multer')).fileUploadFileFilter;
  upload.fileFilter = handoutUploadFileFilter;

  if (lesson) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.lessonHandoutsUpload,
    function(fileInfo) {
      lesson.materialsResources.handoutsFileInput.push(fileInfo);
      uploadFileSuccess(lesson, res);
    }, function (errorMessage) {
      // delete lesson
      uploadFileError(lesson, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Lesson does not exist'
    });
  }
};

exports.uploadTeacherResources = function (req, res) {
  var lesson = req.lesson;
  var upload = multer(config.uploads.lessonTeacherResourcesUpload).single('newTeacherResourceFile', 20);

  var resourceUploadFileFilter = require(path.resolve('./config/lib/multer')).fileUploadFileFilter;
  upload.fileFilter = resourceUploadFileFilter;

  if (lesson) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.lessonTeacherResourcesUpload,
    function(fileInfo) {
      lesson.materialsResources.teacherResourcesFiles.push(fileInfo);
      uploadFileSuccess(lesson, res);
    }, function(errorMessage) {
      uploadFileError(lesson, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Lesson does not exist'
    });
  }
};

exports.uploadStateTestQuestions = function (req, res) {
  var lesson = req.lesson;
  var upload = multer(config.uploads.lessonStateTestQuestionsUpload).single('newStateTestQuestions', 20);
  var questionUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  upload.fileFilter = questionUploadFileFilter;

  if (lesson) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.lessonStateTestQuestionsUpload,
    function(fileInfo) {
      lesson.materialsResources.stateTestQuestions.push(fileInfo);
      uploadFileSuccess(lesson, res);
    }, function(errorMessage) {
      uploadFileError(lesson, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Lesson does not exist'
    });
  }
};

exports.downloadFile = function(req, res){
  res.setHeader('Content-disposition', 'attachment;');
  res.setHeader('content-type', req.query.mimetype);

  request(req.query.path).pipe(res);
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

  var query = Lesson.findById(id).populate('user', 'displayName email team profileImageURL').populate('unit', 'title color icon');

  if (req.query.full) {
    query.populate('standards.cclsElaScienceTechnicalSubjects').populate('standards.cclsMathematics')
    .populate('standards.ngssCrossCuttingConcepts').populate('standards.ngssDisciplinaryCoreIdeas')
    .populate('standards.ngssScienceEngineeringPractices').populate('standards.nycsssUnits')
    .populate('standards.nysssKeyIdeas').populate('standards.nysssMajorUnderstandings').populate('standards.nysssMst');
  }

  query.exec(function(err, lesson) {
    if (err) {
      return next(err);
    } else if (!lesson) {
      return res.status(404).send({
        message: 'No lesson with that identifier has been found'
      });
    }
    console.log('lesson.standards', lesson.standards);
    req.lesson = lesson;
    next();
  });
};
