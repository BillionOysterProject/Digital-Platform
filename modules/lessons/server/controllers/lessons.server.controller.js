'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  SavedLesson = mongoose.model('SavedLesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  archiver = require('archiver'),
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

  if (req.lessonSaved) {
    lesson.saved = req.lessonSaved;
  }

  if (req.query.duplicate) {
    delete lesson._id;
    delete lesson.created;
    delete lesson.title;
    delete lesson.user;
    delete lesson.updated;
    delete lesson.status;
    delete lesson.returnedNotes;
  }

  res.json(lesson);
};

/**
 * Update a lesson
 */
exports.update = function(req, res) {
  var lesson = req.lesson;

  if (lesson) {
    lesson = _.extend(lesson, req.body);
    lesson.returnedNotes = '';

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
 * Publish a lesson
 */
exports.publish = function(req, res) {
  var lesson = req.lesson;

  if (lesson) {
    lesson.status = 'published';
    lesson.returnedNotes = '';

    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //TODO: changed to actual user email address
        email.sendEmail('tforkner@fearless.tech', 'Your lesson ' + lesson.title + ' has been approved',
        'Your lesson has been approved and is now visible on the lessons page.',
        '<p>Your lesson has been approved and is now visible on the lessons page.</p>',
        function(response) {
          res.json(lesson);
        }, function(errorMessage) {
          return res.status(400).send({
            message: errorMessage
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the lesson'
    });
  }
};

/**
 * Return a lesson
 */
exports.return = function(req, res) {
  var lesson = req.lesson;

  if (lesson) {
    lesson.status = 'returned';
    lesson.returnedNotes = req.body.returnedNotes;

    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        email.sendEmail('tforkner@fearless.tech', 'Your lesson ' + lesson.title + ' has been returned',
        'Your lesson has been returned, the following changes need to be made: ' + lesson.returnedNotes + '\n' +
        'You can edit the lesson on the My Library page.',
        '<p>Your lesson has been returned, the following changes need to be made: <br/>' + lesson.returnedNotes + '<br/>' +
        'You can edit the lesson on the My Library page.</p>',
        function(response) {
          res.json(lesson);
        }, function(errorMessage) {
          return res.status(400).send({
            message: errorMessage
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Cannot update the lesson'
    });
  }
};

/**
 * Saved lesson methods
 */
exports.favoriteLesson = function(req, res) {
  var lesson = req.lesson;

  var savedLesson = new SavedLesson({
    user: req.user,
    lesson: lesson
  });

  savedLesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      lesson.saved = true;
      console.log('lesson', lesson);
      res.json(lesson);
    }
  });
};

exports.unfavoriteLesson = function(req, res) {
  var lesson = req.lesson;

  SavedLesson.findOne({ lesson: lesson, user: req.user }).exec(function(err, savedLesson) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!savedLesson) {
      return res.status(400).send({
        message: 'Saved lesson not found'
      });
    } else {
      savedLesson.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          lesson.saved = false;
          res.json(lesson);
        }
      });
    }
  });
};

exports.listFavorites = function(req, res) {
  SavedLesson.find({ user: req.user }).exec(function(err, savedLessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var lessonIds = [];
      for (var i = 0; i < savedLessons.length; i++) {
        lessonIds.push(savedLessons[i].lesson);
      }
      Lesson.find({ _id: { $in: lessonIds } }).populate('user', 'displayName email team profileImageURL')
      .populate('unit', 'title color icon').populate('lessonOverview.subjectAreas', 'subject color')
      .exec(function(err, lessons) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(lessons);
        }
      });
    }
  });
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

  if (req.query.vocabulary) {
    and.push({ 'materialsResources.vocabulary': req.query.vocabulary });
  }

  if (req.query.byCreator) {
    and.push({ 'user': req.user });
  }

  if (req.query.status) {
    if (req.query.status === 'pending') {
      and.push({ 'status': 'pending' });
    } else if (req.query.status === 'published') {
      and.push({ 'status': 'published' });
    }
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
    var limit = Number(req.query.limit);
    if (req.query.page) {
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    } else {
      query.limit(limit);
    }
  }

  query.populate('user', 'displayName email team profileImageURL').populate('unit', 'title color icon')
  .populate('lessonOverview.subjectAreas', 'subject color').exec(function(err, lessons) {
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

exports.downloadZip = function(req, res) {
  var lesson = req.lesson;

  if (req.query.content || req.query.handout || req.query.resources) {
    var archive = archiver('zip');

    archive.on('error', function(err) {
      return res.status(500).send({
        message: err.message
      });
    });

    //on stream closed we can end the request
    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
    });

    //set the archive name
    res.attachment(req.query.filename);
    res.setHeader('Content-Type', 'application/zip, application/octet-stream');

    //this is the streaming magic
    archive.pipe(res);

    var getHandoutContent = function(index, list, handoutCallback) {
      if (index < list.length) {
        var handout = list[index];
        request(handout.path, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            archive.append(body, { name: handout.originalname });
          }
          getHandoutContent(index+1, list, handoutCallback);
        });
      } else {
        handoutCallback();
      }
    };

    var getHandouts = function(handoutsCallback) {
      if (req.query.handout === 'YES') {
        var resources = lesson.materialsResources.handoutsFileInput;
        getHandoutContent(0, resources, handoutsCallback);
      } else {
        handoutsCallback();
      }
    };

    var getResourceContent = function(index, list, resourceCallback) {
      if (index < list.length) {
        var resource = list[index];
        request(resource.path, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            archive.append(body, { name: resource.originalname });
          }
          getResourceContent(index+1, list, resourceCallback);
        });
      } else {
        resourceCallback();
      }
    };

    var getResources = function(resourcesCallback) {
      if (req.query.resources === 'YES') {
        var resources = lesson.materialsResources.teacherResourcesFiles;
        getResourceContent(0, resources, resourcesCallback);
      } else {
        resourcesCallback();
      }
    };

    getHandouts(function() {
      getResources(function() {
        archive.finalize();
      });
    });
  } else {
    return res.status(404).send({
      message: 'Must select something to download'
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

  var query = Lesson.findById(id).populate('user', 'displayName email team profileImageURL')
  .populate('unit', 'title color icon');

  if (req.query.full) {
    query.populate('standards.cclsElaScienceTechnicalSubjects').populate('standards.cclsMathematics')
    .populate('standards.ngssCrossCuttingConcepts').populate('standards.ngssDisciplinaryCoreIdeas')
    .populate('standards.ngssScienceEngineeringPractices').populate('standards.nycsssUnits')
    .populate('standards.nysssKeyIdeas').populate('standards.nysssMajorUnderstandings').populate('standards.nysssMst')
    .populate('materialsResources.vocabulary').populate('lessonOverview.subjectAreas');
  }

  query.exec(function(err, lesson) {
    if (err) {
      return next(err);
    } else if (!lesson) {
      return res.status(404).send({
        message: 'No lesson with that identifier has been found'
      });
    }

    if (req.query.full) {
      SavedLesson.findOne({ lesson: lesson, user: req.user }).exec(function(err, savedLesson) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.lesson = lesson;
          req.lessonSaved = (savedLesson) ? true : false;
          next();
        }
      });
    } else {
      req.lesson = lesson;
      next();
    }
  });
};
