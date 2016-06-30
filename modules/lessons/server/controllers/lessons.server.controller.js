'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  LessonActivity = mongoose.model('LessonActivity'),
  SavedLesson = mongoose.model('SavedLesson'),
  Glossary = mongoose.model('Glossary'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  docx = require(path.resolve('./modules/core/server/controllers/docx.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  archiver = require('archiver'),
  request = require('request'),
  path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

var validateLesson = function(lesson, successCallback, errorCallback) {
  var errorMessages = [];

  if (!lesson.title) {
    errorMessages.push('Lesson title is required');
  }
  if (!lesson.unit) {
    errorMessages.push('Unit is required');
  }

  // Lesson Overview
  if (!lesson.lessonOverview || !lesson.lessonOverview.grade) {
    errorMessages.push('Grade is required');
  }
  if (!lesson.lessonOverview || !lesson.lessonOverview.classPeriods) {
    errorMessages.push('Class periods is required');
  }
  if (!lesson.lessonOverview || !lesson.lessonOverview.setting) {
    errorMessages.push('Setting is required');
  }
  if (!lesson.lessonOverview || !lesson.lessonOverview.subjectAreas || lesson.lessonOverview.subjectAreas.length <= 0) {
    errorMessages.push('Subject area(s) is required');
  }
  if (!lesson.lessonOverview || !lesson.lessonOverview.lessonSummary) {
    errorMessages.push('Lesson summary is required');
  }

  if (!lesson.lessonObjectives) {
    errorMessages.push('Lesson objectives is required');
  }

  // Material Resources
  if (!lesson.materialsResources || !lesson.materialsResources.supplies) {
    errorMessages.push('Supplies is required');
  }
  if (!lesson.materialsResources || !lesson.materialsResources.vocabulary) {
    errorMessages.push('Vocabulary is required');
  }

  if (!lesson.background) {
    errorMessages.push('Background is required');
  }

  if ((!lesson.instructionPlan) ||
  (!lesson.instructionPlan.engage && !lesson.instructionPlan.explore && !lesson.instructionPlan.explain &&
  !lesson.instructionPlan.elaborate && !lesson.instructionPlan.evaluate)) {
    errorMessages.push('At least one Instruction plan is required');
  }

  if ((!lesson.standards) ||
  (!lesson.standards.cclsElaScienceTechnicalSubjects && !lesson.standards.cclsMathematics &&
  !lesson.standards.ngssCrossCuttingConcepts && !lesson.standards.ngssDisciplinaryCoreIdeas &&
  !lesson.standards.ngssScienceEngineeringPractices && !lesson.standards.nycsssUnits &&
  !lesson.standards.nysssKeyIdeas && !lesson.standards.nysssMajorUnderstandings &&
  !lesson.standards.nysssMst)) {
    errorMessages.push('At least one Standard is required');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(lesson);
  }
};

/**
 * Create a Lesson
 */
exports.create = function(req, res) {
  validateLesson(req.body,
  function(lessonJSON) {
    var lesson = new Lesson(lessonJSON);

    lesson.user = req.user;
    lesson.materialsResources.handoutsFileInput = [];
    lesson.materialsResources.teacherResourcesFiles = [];
    lesson.materialsResources.stateTestQuestions = [];
    lesson.status = 'pending';

    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(config.mailer.admin, 'A new lesson is pending approval', 'lesson_waiting', {
          TeamLeadName: req.user.displayName,
          LessonName: lesson.title,
          LinkLessonRequest: httpTransport + req.headers.host + '/library/user'
        }, function(info) {
          res.json(lesson);
        }, function(errorMessage) {
          res.json(lesson);
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

  if (!lesson.isCurrentUserOwner) {
    var activity = new LessonActivity({
      user: req.user,
      lesson: lesson,
      activity: (req.query.duplicate) ? 'duplicated' : 'viewed'
    });

    activity.save(function(err) {
      res.json(lesson);
    });
  } else {
    res.json(lesson);
  }
};

/**
 * Incrementally save a lesson
 */
exports.incrementalSave = function(req, res) {
  console.log('incrementalSave');
  var lesson = req.lesson;

  if (lesson) {
    lesson = _.extend(lesson, req.body);
    lesson.returnedNotes = '';
    if (!req.body.initial) lesson.status = 'draft';

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
  } else {
    lesson = new Lesson(req.body);

    lesson.user = req.user;
    lesson.materialsResources.handoutsFileInput = [];
    lesson.materialsResources.teacherResourcesFiles = [];
    lesson.materialsResources.stateTestQuestions = [];
    lesson.status = 'draft';
  }

  lesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      validateLesson(lesson,
      function(lessonJSON) {
        res.json({
          lesson: lesson,
          successful: true
        });
      }, function (errorMessages) {
        res.json({
          lesson: lesson,
          errors: errorMessages
        });
      });
    }
  });
};

/**
 * Update a lesson
 */
exports.update = function(req, res) {
  var lesson = req.lesson;
  validateLesson(req.body,
  function(lessonJSON) {
    if (lesson) {
      lesson = _.extend(lesson, lessonJSON);
      lesson.returnedNotes = '';
      lesson.status = 'pending';

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
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
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
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been approved',
        'lesson_approved', {
          FirstName: lesson.user.firstName,
          LessonName: lesson.title,
          LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
          LinkProfile: httpTransport + req.headers.host + '/settings/profile'
        },
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
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been returned',
        'lesson_returned', {
          FirstName: lesson.user.firstName,
          LessonName: lesson.title,
          LessonReturnedNote: lesson.returnedNotes,
          LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
          LinkProfile: httpTransport + req.headers.host + '/settings/profile'
        },
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

  if (filesToDelete.length > 0) {
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
  } else {
    lesson.remove(function(err) {
      if (err) {
        errorCallback(errorHandler.getErrorMessage(err));
      } else {
        successCallback(lesson);
      }
    });
  }
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

  var or = [];
  var searchRe;
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'title': searchRe });
    or.push({ 'lessonOverview.lessonSummary': searchRe });
    or.push({ 'lessonObjectives': searchRe });

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

  var archive = archiver('zip');

  var lessonDocxFilepath = '';

  archive.on('error', function(err) {
    return res.status(500).send({
      message: err.message
    });
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    if (lessonDocxFilepath && lessonDocxFilepath !== '') {
      fs.exists(lessonDocxFilepath, function(exists) {
        if (exists) {
          fs.unlink(lessonDocxFilepath);
        }
      });
    }
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment(req.query.filename);
  res.setHeader('Content-Type', 'application/zip, application/octet-stream');

  //this is the streaming magic
  archive.pipe(res);

  if (req.query.content === 'YES' || req.query.handout === 'YES' || req.query.resources === 'YES') {
    var getLessonContent = function(lessonCallback) {
      if (req.query.content === 'YES') {
        docx.createLessonDocx(path.resolve('./modules/lessons/server/templates/lesson.docx'), lesson,
        function(filepath) {
          var filename = _.replace(lesson.title + '.docx', /\s/, '_');
          console.log('filepath', path.resolve(filepath));
          lessonDocxFilepath = path.resolve(filepath);
          archive.file(lessonDocxFilepath, { name: filename });
          lessonCallback();
        }, function(errorMessage) {
          return res.status(400).send({
            message: errorMessage
          });
        });
      } else {
        lessonCallback();
      }
    };

    var getHandoutContent = function(index, list, handoutCallback) {
      if (index < list.length) {
        var handout = list[index];
        var requestSettings = {
          method: 'GET',
          url: handout.path,
          encoding: null
        };
        request(requestSettings, function (error, response, body) {
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
        var requestSettings = {
          method: 'GET',
          url: resource.path,
          encoding: null
        };
        request(requestSettings, function (error, response, body) {
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

    getLessonContent(function() {
      getHandouts(function() {
        getResources(function() {
          var activity = new LessonActivity({
            user: req.user,
            lesson: req.lesson,
            activity: 'downloaded'
          });

          activity.save(function(err) {
            archive.finalize();
          });
        });
      });
    });
  } else {
    // return res.status(404).send({
    //   message: 'Must select something to download'
    // });
    archive.append('No files selected', { name: 'error.txt' });
    archive.finalize();
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

  var query = Lesson.findById(id).populate('user', 'firstName displayName email team profileImageURL')
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
    } else if (!lesson && id !== '000000000000000000000000') {
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
