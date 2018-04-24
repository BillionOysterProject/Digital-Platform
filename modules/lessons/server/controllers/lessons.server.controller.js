'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  LessonActivity = mongoose.model('LessonActivity'),
  LessonTracker = mongoose.model('LessonTracker'),
  LessonFeedback = mongoose.model('LessonFeedback'),
  SavedLesson = mongoose.model('SavedLesson'),
  MetaSubjectArea = mongoose.model('MetaSubjectArea'),
  Team = mongoose.model('Team'),
  Unit = mongoose.model('Unit'),
  Glossary = mongoose.model('Glossary'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  archiver = require('archiver'),
  request = require('request'),
  path = require('path'),
  multer = require('multer'),
  moment = require('moment'),
  wkhtmltopdf = require('wkhtmltopdf'),
  exec = require('child_process').exec,
  async = require('async'),
  config = require(path.resolve('./config/config'));

var validateLesson = function(lesson, successCallback, errorCallback) {
  var errorMessages = [];

  if (!lesson.title) {
    errorMessages.push('Lesson title is required');
  }

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(lesson);
  }
};

var addLessonToUnits = function(lesson, callback) {
  async.forEach(lesson.units, function(unit, unitCallback) {
    Unit.findOne({ _id: unit }).exec(function(err, unitObj) {
      if (err) {
        unitCallback();
      } else if (unitObj) {
        var index = _.findIndex(unitObj.lessons, function(l) {
          if (l && lesson && lesson._id) {
            return l.toString() === lesson._id.toString();
          } else {
            return false;
          }
        });
        if (index === -1) {
          unitObj.lessons.push(lesson);
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

var removeLessonFromUnits = function(lesson, callback) {
  async.forEach(lesson.units, function(unit, unitCallback) {
    Unit.findOne({ _id: unit }).exec(function(err, unitObj) {
      if (err) {
        unitCallback();
      } else if (unitObj) {
        var index = _.findIndex(unitObj.lessons, function(l) {
          if (l && lesson && lesson._id) {
            return l.toString() === lesson._id.toString();
          } else {
            return false;
          }
        });
        if (index > -1) {
          unitObj.lessons.splice(index, 1);
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

var setPdfToDownload = function(host, cookies, lesson, callback) {
  var httpTransport = (process.env.NODE_ENV === 'development-local') ? 'http://' : 'https://';
  var input = 'https://platform-beta.bop.nyc/lessons/' + lesson._id + '?layout=print';

  var filename = _.replace(lesson.title, /[^0-9a-zA-Z-.,_\s]/g, '');
  filename = _.replace(filename + '.pdf', /\s/g, '_');

  var output = path.resolve(config.uploads.lessonDownloadPdfUpload.dest) + '/' + filename;
  var mimetype = 'application/pdf';

  var command = 'wkhtmltopdf --page-width 800px --page-height 1200px --viewport-size 800x1200 \'' + input + '\' \'' + output + '\'';
  console.log('exec: ', command);

  exec(command, function(error, stdout, stderr) {
    if (error) {
      console.log('wkhtmltopdf error: ', error);
      callback(error);
    } else {
      console.log('wkhmtltopdf stderr: ', stderr);
      console.log('wkhtmltopdf stdout: ', stdout);
      var uploadRemote = new UploadRemote();
      uploadRemote.saveLocalAndRemote(filename, mimetype, config.uploads.lessonDownloadPdfUpload,
      function(fileInfo) {
        lesson.downloadPdf = fileInfo;
        lesson.save(function(err) {
          if (err) {
            console.log('save file info error: ', err);
            callback(err);
          }
          callback(null, fileInfo);
        });
      }, function(errorMessage) {
        console.log('save image remotely error: ', errorMessage);
        callback(errorMessage);
      });
    }
  });
};

var updateHandouts = function(lesson) {
  var existingHandouts = [];
  if (lesson && lesson.materialsResources && lesson.materialsResources.handoutsFileInput) {
    for (var i = 0; i < lesson.materialsResources.handoutsFileInput.length; i++) {
      var handout = lesson.materialsResources.handoutsFileInput[i];
      if (handout.path !== undefined && handout.path !== '' &&
        handout.originalname !== undefined && handout.originalname !== '' &&
        handout.filename !== undefined && handout.filename !== '' &&
        handout.mimetype !== undefined && handout.mimetype !== '') {
        existingHandouts.push(handout);
      }
    }
  }
  return existingHandouts;
};

var updateResources = function(lesson) {
  var existingResources = [];
  if (lesson && lesson.materialsResources && lesson.materialsResources.teacherResourcesFiles) {
    for (var j = 0; j < lesson.materialsResources.teacherResourcesFiles.length; j++) {
      var resource = lesson.materialsResources.teacherResourcesFiles[j];
      if (resource.path !== undefined && resource.path !== '' &&
        resource.originalname !== undefined && resource.originalname !== '' &&
        resource.filename !== undefined && resource.filename !== '' &&
        resource.mimetype !== undefined && resource.mimetype !== '') {
        existingResources.push(resource);
      }
    }
  }
  return existingResources;
};

var updateMaterials = function(lesson) {
  var existingMaterials = [];
  if (lesson && lesson.materialsResources && lesson.materialsResources.lessonMaterialFiles) {
    for (var j = 0; j < lesson.materialsResources.lessonMaterialFiles.length; j++) {
      var resource = lesson.materialsResources.lessonMaterialFiles[j];
      if (resource.path !== undefined && resource.path !== '' &&
        resource.originalname !== undefined && resource.originalname !== '' &&
        resource.filename !== undefined && resource.filename !== '' &&
        resource.mimetype !== undefined && resource.mimetype !== '') {
        existingMaterials.push(resource);
      }
    }
  }
  return existingMaterials;
};

var updateQuestions = function(lesson) {
  var existingQuestions = [];
  if (lesson && lesson.materialsResources && lesson.materialsResources.stateTestQuestions) {
    for (var k = 0; k < lesson.materialsResources.stateTestQuestions.length; k++) {
      var question = lesson.materialsResources.stateTestQuestions[k];
      if (question.path !== undefined && question.path !== '' &&
        question.originalname !== undefined && question.originalname !== '' &&
        question.filename !== undefined && question.filename !== '' &&
        question.mimetype !== undefined && question.mimetype !== '') {
        existingQuestions.push(question);
      }
    }
  }
  return existingQuestions;
};

/**
 * Create a Lesson
 */
exports.create = function(req, res) {
  validateLesson(req.body,
  function(lessonJSON) {
    var lesson = new Lesson(lessonJSON);

    lesson.user = req.user;
    lesson.materialsResources.handoutsFileInput = updateHandouts(req.body);
    lesson.materialsResources.teacherResourcesFiles = updateResources(req.body);
    lesson.materialsResources.lessonMaterialFiles = updateMaterials(req.body);
    lesson.materialsResources.stateTestQuestions = updateQuestions(req.body);

    var pattern = /^data:image\/[a-z]*;base64,/i;
    if (lesson.featuredImage && lesson.featuredImage.path && pattern.test(lesson.featuredImage.path)) {
      lesson.featuredImage.path = '';
    }

    lesson.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (lesson.status === 'pending') {
          var activity = new LessonActivity({
            user: req.user,
            lesson: lesson,
            activity: 'submitted'
          });

          activity.save(function(err) {
            addLessonToUnits(lesson, function() {
              res.json(lesson);
              setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
                var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                email.sendEmailTemplate(config.mailer.admin, 'A new lesson is pending approval', 'lesson_waiting', {
                  TeamLeadName: req.user.displayName,
                  LessonName: lesson.title,
                  LinkLessonRequest: httpTransport + req.headers.host + '/library/user',
                  LinkProfile: httpTransport + req.headers.host + '/profiles'
                }, function(info) {
                  // res.json(lesson);
                }, function(errorMessage) {
                  // res.json(lesson);
                });
              });
            });
          });
        } else {
          res.json(lesson);
        }
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

  if (req.team) {
    lesson.user.team = req.team;
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
 * Update a lesson
 */
exports.update = function(req, res) {
  var lesson = req.lesson;
  validateLesson(req.body,
  function(lessonJSON) {
    if (lesson) {
      lesson = _.extend(lesson, lessonJSON);
      lesson.returnedNotes = '';

      lesson.materialsResources.handoutsFileInput = updateHandouts(req.body);
      lesson.materialsResources.teacherResourcesFiles = updateResources(req.body);
      lesson.materialsResources.lessonMaterialFiles = updateMaterials(req.body);
      lesson.materialsResources.stateTestQuestions = updateQuestions(req.body);

      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (lesson.featuredImage && lesson.featuredImage.path && pattern.test(lesson.featuredImage.path)) {
        lesson.featuredImage.path = '';
      }

      if (!lesson.updated) lesson.updated = [];
      lesson.updated.push(Date.now());

      lesson.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if (lesson.status === 'pending') {
            var activity = new LessonActivity({
              user: req.user,
              lesson: lesson,
              activity: 'submitted'
            });

            activity.save(function(err) {
              removeLessonFromUnits(req.lesson, function() {
                addLessonToUnits(lesson, function() {
                  res.json(lesson);
                  setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
                    var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                    email.sendEmailTemplate(config.mailer.admin, 'An updated lesson is pending approval', 'lesson_waiting', {
                      TeamLeadName: req.user.displayName,
                      LessonName: lesson.title,
                      LinkLessonRequest: httpTransport + req.headers.host + '/library/user',
                      LinkProfile: httpTransport + req.headers.host + '/profiles'
                    }, function(info) {
                      // res.json(lesson);
                    }, function(errorMessage) {
                      // res.json(lesson);
                    });
                  });
                });
              });
            });
          } else {
            res.json(lesson);
          }
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
        var activity = new LessonActivity({
          user: req.user,
          lesson: lesson,
          activity: 'published'
        });

        activity.save(function(err) {
          removeLessonFromUnits(req.lesson, function() {
            addLessonToUnits(lesson, function() {
              res.json(lesson);
              setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
                var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been approved',
                'lesson_approved', {
                  FirstName: lesson.user.firstName,
                  LessonName: lesson.title,
                  LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
                  LinkProfile: httpTransport + req.headers.host + '/profiles'
                },
                function(response) {
                  // res.json(lesson);
                }, function(errorMessage) {
                  // return res.status(400).send({
                  //   message: errorMessage
                  // });
                });
              });
            });
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
        var activity = new LessonActivity({
          user: req.user,
          lesson: lesson,
          activity: 'returned',
          additionalInfo: req.body.returnedNotes
        });

        activity.save(function(err) {
          removeLessonFromUnits(req.lesson, function() {
            addLessonToUnits(lesson, function() {
              res.json(lesson);
              setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
                var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been returned',
                'lesson_returned', {
                  FirstName: lesson.user.firstName,
                  LessonName: lesson.title,
                  LessonReturnedNote: lesson.returnedNotes,
                  LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
                  LinkProfile: httpTransport + req.headers.host + '/profiles'
                },
                function(response) {
                  // res.json(lesson);
                }, function(errorMessage) {
                  // return res.status(400).send({
                  //   message: errorMessage
                  // });
                });
              });
            });
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
      var activity = new LessonActivity({
        user: req.user,
        lesson: lesson,
        activity: 'liked'
      });

      activity.save(function(err) {
        lesson.saved = true;
        res.json(lesson);
      });
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
          var activity = new LessonActivity({
            user: req.user,
            lesson: lesson,
            activity: 'unliked'
          });

          activity.save(function(err) {
            lesson.saved = false;
            res.json(lesson);
          });
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
      .populate('unit', 'title color icon').populate('units', 'title color icon')
      .populate('lessonOverview.subjectAreas', 'subject color')
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
 * Track a lesson
 */
exports.trackLesson = function(req, res) {
  var lesson = req.lesson;
  var user = req.user;

  var trackedLesson = new LessonTracker(req.body.tracker);
  trackedLesson.taughtOn = moment(req.body.tracker.taughtOn, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
  trackedLesson.user = user;
  trackedLesson.lesson = lesson;

  trackedLesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var activity = new LessonActivity({
        user: req.user,
        lesson: lesson,
        activity: 'taught'
      });

      activity.save(function(err) {
        res.json(trackedLesson);
        setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {});
      });
    }
  });
};

exports.listTrackedLessonsForUser = function(req, res) {
  var user = (req.query.userId ? req.query.userId : req.user);

  //get the unique lessonids that this person taught - they could have
  //marked a lesson taught more than once
  LessonTracker.find({ user: user }).distinct('lesson', function(err, trackedLessonIds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if(trackedLessonIds && trackedLessonIds.length > 0) {
      //get the lessons that match those ids
      Lesson.find({ _id: { $in: trackedLessonIds } }).exec(function(err, lessons) {
        if(err) {
          return res.status(400).send({
            message: 'No lessons found. ' + errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(lessons);
        }
      });
    } else {
      res.json([]);
    }
  });
};

exports.listTrackedForLessonAndUser = function(req, res) {
  var lesson = req.lesson;

  LessonTracker.find({ lesson: lesson, user: req.user }).populate('lesson', 'title')
  .populate('user', 'displayName email team profileImageURL')
  .populate('classOrSubject', 'subject color').exec(function(err, trackedLessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trackedLessons);
    }
  });
};

exports.listTrackedForLesson = function(req, res) {
  var lesson = req.lesson;

  LessonTracker.find({ lesson: lesson }).populate('lesson', 'title')
  .populate('user', 'displayName email team profileImageURL')
  .populate('classOrSubject', 'subject color').exec(function(err, trackedLessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trackedLessons);
    }
  });
};

exports.trackedStatsForLesson = function(req, res) {
  var lesson = req.lesson;
  var stats = {};
  var query = { lesson: lesson._id };
  LessonTracker.aggregate([
    { $match: { lesson: lesson._id } },
    { $group: {
      _id: null,
      taughtCount: { $sum: 1 },
      studentCount: { $sum: '$totalNumberOfStudents' },
      avgStudentsPerClass: { $avg: '$totalNumberOfStudents' },
      studentsPerClassCount: { $sum: '$totalNumberOfStudents' },
      avgClassesOrSections: { $avg: '$totalNumberOfClassesOrSections' },
      classesOrSectionsCount: { $sum: '$totalNumberOfClassesOrSections' },
      avgPeriodsOrSessions: { $avg: '$classPeriodsOrSessionsNeededToComplete' },
      periodsOrSessionsCount: { $sum: '$classPeriodsOrSessionsNeededToComplete' }
    } }
  ], function(err1, result) {
    if (err1) {
      res.status(400).send({
        message: 'Could not retrieve averages'
      });
    } else {
      LessonTracker.find(query).distinct('user', function(err2, teamLeads) {
        if (err2) {
          res.status(400).send({
            message: 'Count not retrieve team lead count'
          });
        } else {
          var teamLeadCount = (teamLeads) ? teamLeads.length : 0;
          LessonTracker.find(query).distinct('grade', function(err3, grades) {
            if (err3) {
              res.status(400).send({
                message: 'Could not retrieve grades'
              });
            } else {
              LessonTracker.find(query).distinct('classOrSubject', function(err4, subjectIds) {
                if (err4) {
                  res.status(400).send({
                    message: 'Could not retrieve subject ids'
                  });
                } else {
                  MetaSubjectArea.find({ '_id' : { $in: subjectIds } }).exec(function(err5, subjects) {
                    if (err5) {
                      res.status(400).send({
                        message: 'Could not retrieve subjects'
                      });
                    } else {
                      res.json({
                        taughtCount: (result[0]) ? result[0].taughtCount : 0,
                        teamLeadCount: (teamLeadCount) ? teamLeadCount : 0,
                        studentCount: (result[0]) ? result[0].studentCount : 0,
                        avgStudentsPerClass: (result[0]) ? result[0].avgStudentsPerClass : 0,
                        studentsPerClassCount: (result[0]) ? result[0].studentsPerClassCount : 0,
                        avgClassesOrSections: (result[0]) ? result[0].avgClassesOrSections : 0,
                        classesOrSectionsCount: (result[0]) ? result[0].classesOrSectionsCount : 0,
                        avgPeriodsOrSessions: (result[0]) ? result[0].avgPeriodsOrSessions : 0,
                        periodsOrSessionsCount: (result[0]) ? result[0].periodsOrSessionsCount : 0,
                        subjects: subjects,
                        grades: grades
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

/**
 * Feedback for a lesson
 */
exports.lessonFeedback = function(req, res) {
  var lesson = req.lesson;
  var user = req.user;

  var lessonFeedback = new LessonFeedback(req.body.feedback);
  lessonFeedback.user = user;
  lessonFeedback.lesson = lesson;

  lessonFeedback.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var activity = new LessonActivity({
        user: req.user,
        lesson: lesson,
        activity: 'feedback'
      });

      activity.save(function(err) {
        res.json(lessonFeedback);
        setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
          var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
          var subject = 'Feedback from ' + req.user.displayName + ' about your lesson ' + req.body.lesson.title;
          var toList = [lesson.user.email, config.mailer.admin];

          email.sendEmailTemplate(toList, subject,
          'lesson_feedback', {
            FirstName: req.body.lesson.user.firstName,
            LessonFeedbackName: req.user.displayName,
            LessonName: req.body.lesson.title,
            LessonFeedbackNote: req.body.message,
            LessonEffective: (lessonFeedback.lessonEffective) ? lessonFeedback.lessonEffective : 0,
            LessonAlignWithCurriculumn: (lessonFeedback.lessonAlignWithCurriculumn) ? lessonFeedback.lessonAlignWithCurriculumn : 0,
            LessonSupportScientificPractice: (lessonFeedback.lessonSupportScientificPractice) ? lessonFeedback.lessonSupportScientificPractice : 0,
            LessonPreparesStudents: (lessonFeedback.lessonPreparesStudents) ? lessonFeedback.lessonPreparesStudents : 0,
            HowLessonTaught: (lessonFeedback.howLessonTaught) ? lessonFeedback.howLessonTaught : '',
            WhyLessonTaughtNow: (lessonFeedback.whyLessonTaughtNow) ? lessonFeedback.whyLessonTaughtNow : '',
            WillTeachLessonAgain: (lessonFeedback.willTeachLessonAgain) ? lessonFeedback.willTeachLessonAgain : '',
            LessonSummary: (lessonFeedback.additionalFeedback.lessonSummary) ? lessonFeedback.additionalFeedback.lessonSummary : '',
            LessonObjectives: (lessonFeedback.additionalFeedback.lessonObjectives) ? lessonFeedback.additionalFeedback.lessonObjectives : '',
            MaterialsResources: (lessonFeedback.additionalFeedback.materialsResources) ? lessonFeedback.additionalFeedback.materialsResources : '',
            Preparation: (lessonFeedback.additionalFeedback.preparation) ? lessonFeedback.additionalFeedback.preparation : '',
            Background: (lessonFeedback.additionalFeedback.background) ? lessonFeedback.additionalFeedback.background : '',
            InstructionPlan: (lessonFeedback.additionalFeedback.instructionPlan) ? lessonFeedback.additionalFeedback.instructionPlan : '',
            Standards: (lessonFeedback.additionalFeedback.standards) ? lessonFeedback.additionalFeedback.standards : '',
            Other: (lessonFeedback.additionalFeedback.other) ? lessonFeedback.additionalFeedback.other : '',
            LinkLesson: httpTransport + req.headers.host + '/lessons/' + req.body.lesson._id,
            LinkProfile: httpTransport + req.headers.host + '/profiles'
          },
          function(response) {
            // res.json(lessonFeedback);
          }, function(errorMessage) {
            // return res.status(400).send({
            //   message: errorMessage
            // });
          });
        });
      });
    }
  });
};

exports.listFeedbackForLesson = function(req, res) {
  var lesson = req.lesson;

  LessonFeedback.find({ lesson: lesson }).populate('lesson', 'title')
  .populate('user', 'displayName email team profileImageURL').exec(function(err, feedback) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

exports.feedbackForLesson = function(req, res) {
  var lesson = req.lesson;

  LessonFeedback.aggregate([
    { $match: { lesson: lesson._id } },
    { $group: {
      _id: null,
      lessonEffective: { $avg: '$lessonEffective' },
      lessonAlignWithCurriculumn: { $avg: '$lessonAlignWithCurriculumn' },
      lessonSupportScientificPractice: { $avg: '$lessonSupportScientificPractice' },
      lessonPreparesStudents: { $avg: '$lessonPreparesStudents' }
    } }
  ], function(err, result) {
    if (err) {
      res.status(400).send({
        message: 'Could not retrieve averages'
      });
    } else {
      LessonFeedback.find({ lesson: lesson._id }).sort('-created').populate('user', 'displayName').exec(function(err1, feedbackList) {
        if (err1) {
          res.status(400).send({
            message: 'Could not retrieve feedback'
          });
        } else {
          //Get array of feedback
          var howLessonTaughtFeedback = [];
          var whyLessonTaughtNowFeedback = [];
          var willTeachLessonAgainFeedback = [];
          var lessonSummaryFeedback = [];
          var lessonObjectivesFeedback = [];
          var materialsResourcesFeedback = [];
          var preparationFeedback = [];
          var backgroundFeedback = [];
          var instructionPlanFeedback = [];
          var standardsFeedback = [];
          var otherFeedback = [];
          for (var i = 0; i < feedbackList.length; i++) {
            var feedback = feedbackList[i];
            var author = feedback.user.displayName;
            var date = moment(feedback.created).format('MMMM D, YYYY');

            if (feedback.howLessonTaught) howLessonTaughtFeedback.push({ author: author, date: date,
              feedback: feedback.howLessonTaught });
            if (feedback.whyLessonTaughtNow) whyLessonTaughtNowFeedback.push({ author: author, date: date,
              feedback: feedback.whyLessonTaughtNow });
            if (feedback.willTeachLessonAgain) willTeachLessonAgainFeedback.push({ author: author, date: date,
              feedback: feedback.willTeachLessonAgain });
            if (feedback.additionalFeedback.lessonSummary) lessonSummaryFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.lessonSummary });
            if (feedback.additionalFeedback.lessonObjectives) lessonObjectivesFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.lessonObjectives });
            if (feedback.additionalFeedback.materialsResources) materialsResourcesFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.materialsResources });
            if (feedback.additionalFeedback.preparation) preparationFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.preparation });
            if (feedback.additionalFeedback.background) backgroundFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.background });
            if (feedback.additionalFeedback.instructionPlan) instructionPlanFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.instructionPlan });
            if (feedback.additionalFeedback.standards) standardsFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.standards });
            if (feedback.additionalFeedback.other) otherFeedback.push({ author: author, date: date,
              feedback: feedback.additionalFeedback.other });
          }

          res.json({
            lessonEffectiveAvg: (result[0]) ? result[0].lessonEffective : 0,
            lessonAlignWithCurriculumnAvg: (result[0]) ? result[0].lessonAlignWithCurriculumn : 0,
            lessonSupportScientificPracticeAvg: (result[0]) ? result[0].lessonSupportScientificPractice : 0,
            lessonPreparesStudentsAvg: (result[0]) ? result[0].lessonPreparesStudents : 0,
            howLessonTaughtFeedback: howLessonTaughtFeedback,
            whyLessonTaughtNowFeedback: whyLessonTaughtNowFeedback,
            willTeachLessonAgainFeedback: willTeachLessonAgainFeedback,
            lessonSummaryFeedback: lessonSummaryFeedback,
            lessonObjectivesFeedback: lessonObjectivesFeedback,
            materialsResourcesFeedback: materialsResourcesFeedback,
            preparationFeedback: preparationFeedback,
            backgroundFeedback: backgroundFeedback,
            instructionPlanFeedback: instructionPlanFeedback,
            standardsFeedback: standardsFeedback,
            otherFeedback: otherFeedback
          });
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
    if (lesson.downloadPdf && lesson.downloadPdf.path) {
      filesToDelete.push(lesson.downloadPdf.path);
    }
    if (lesson.materialsResources) {
      if (lesson.materialsResources.teacherResourcesFiles && lesson.materialsResources.teacherResourcesFiles.path) {
        for (var i = 0; i < lesson.materialsResources.teacherResourcesFiles.length; i++) {
          filesToDelete.push(lesson.materialsResources.teacherResourcesFiles[i].path);
        }
      }
      if (lesson.materialsResources.handoutsFileInput && lesson.materialsResources.handoutsFileInput.path) {
        for (var j = 0; j < lesson.materialsResources.handoutsFileInput.length; j++) {
          filesToDelete.push(lesson.materialsResources.handoutsFileInput[j].path);
        }
      }
      if (lesson.materialsResources.stateTestQuestions && lesson.materialsResources.stateTestQuestions.path) {
        for (var k = 0; k < lesson.materialsResources.stateTestQuestions.length; k++) {
          filesToDelete.push(lesson.materialsResources.stateTestQuestions[k].path);
        }
      }
    }
  }

  if (filesToDelete.length > 0) {
    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      removeLessonFromUnits(lesson, function() {
        lesson.remove(function(err) {
          if (err) {
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(lesson);
          }
        });
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

  var settingsRe;
  if (req.query.setting) {
    try {
      settingsRe = new RegExp(req.query.setting, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Setting is invalid'
      });
    }
    and.push({ 'lessonOverview.setting' : settingsRe });
  }

  if (req.query.unit) {
    and.push({ 'unit': req.query.unit });
  }

  if (req.query.vocabulary) {
    and.push({ 'materialsResources.vocabulary': req.query.vocabulary });
  }

  if (req.query.byCreator) {
    if (req.query.byCreator === 'true') {
      and.push({ 'user': req.user });
    } else {
      and.push({ 'user': req.query.byCreator });
    }
  }

  if (req.query.status) {
    if (req.query.status === 'pending') {
      and.push({ 'status': 'pending' });
    } else if (req.query.status === 'published') {
      and.push({ 'status': 'published' });
    }
  }

  if (req.query.published === 'true') {
    and.push({ 'status': 'published' });
  } else if (req.query.published === 'false') {
    and.push({ 'status': { '$ne': 'published' } });
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

  query.populate('user', 'displayName email team profileImageURL')
  .populate('unit', 'title color icon').populate('units', 'title color icon')
  .populate('lessonOverview.subjectAreas', 'subject color').exec(function(err, lessons) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (req.query.stats) {
        var getStats = function(lessons, index, callback) {
          if (index < lessons.length) {
            var lesson = (lessons[index]) ? lessons[index].toJSON() : {};
            LessonTracker.find({ lesson: lesson._id }).distinct('user', function(err, teamLeads) {
              if (!err) {
                lesson.stats = {
                  teamLeadCount: (teamLeads) ? teamLeads.length : 0
                };
                lessons[index] = lesson;
              }
              getStats(lessons, index+1, callback);
            });
          } else {
            callback();
          }
        };

        getStats(lessons, 0, function() {
          res.json(lessons);
        });
      } else {
        res.json(lessons);
      }
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
  return res.status(400).send({
    message: errorMessage
  });
  // deleteInternal(lesson,
  // function(lesson) {
  //   return res.status(400).send({
  //     message: errorMessage
  //   });
  // }, function(err) {
  //   return res.status(400).send({
  //     message: err
  //   });
  // });
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

exports.uploadLessonMaterialFiles = function (req, res) {
  var lesson = req.lesson;
  var upload = multer(config.uploads.lessonMaterialFilesUpload).single('newLessonMaterialResourceFile', 20);

  var resourceUploadFileFilter = require(path.resolve('./config/lib/multer')).fileUploadFileFilter;
  upload.fileFilter = resourceUploadFileFilter;

  if (lesson) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.lessonMaterialFilesUpload,
    function(fileInfo) {
      lesson.materialsResources.lessonMaterialFiles.push(fileInfo);
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

  if (req.query.content === 'YES' || req.query.handout === 'YES' || req.query.materials === 'YES' ||
    req.query.resources === 'YES' || req.query.questions === 'YES') {
    var getLessonContent = function(lessonCallback) {
      var attachLessonPdf = function(path, name) {
        var requestSettings = {
          method: 'GET',
          url: path,
          encoding: null
        };
        request(requestSettings, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            archive.append(body, { name: name });
          }
          lessonCallback();
        });
      };

      if (req.query.content === 'YES') {
        if (lesson.downloadPdf && lesson.downloadPdf.path && lesson.downloadPdf.originalname) {
          attachLessonPdf(lesson.downloadPdf.path, lesson.downloadPdf.originalname);
        } else {
          setPdfToDownload(req.headers.host, req.cookies, lesson, function(err, fileInfo) {
            if (fileInfo) {
              attachLessonPdf(fileInfo.path, fileInfo.originalname);
            } else {
              lessonCallback();
            }
          });
        }
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

    var getMaterialContent = function(index, list, materialCallback) {
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
          getMaterialContent(index+1, list, materialCallback);
        });
      } else {
        materialCallback();
      }
    };

    var getMaterials = function(materialCallback) {
      if (req.query.materials === 'YES') {
        var resources = lesson.materialsResources.lessonMaterialFiles;
        getMaterialContent(0, resources, materialCallback);
      } else {
        materialCallback();
      }
    };

    var getStateTestQuestionContent = function(index, list, stateTestCallback) {
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
          getStateTestQuestionContent(index+1, list, stateTestCallback);
        });
      } else {
        stateTestCallback();
      }
    };

    var getStateTestQuestions = function(stateTestCallback) {
      if (req.query.questions === 'YES') {
        var resources = lesson.materialsResources.stateTestQuestions;
        getStateTestQuestionContent(0, resources, stateTestCallback);
      } else {
        stateTestCallback();
      }
    };

    getLessonContent(function() {
      getHandouts(function() {
        getResources(function() {
          getMaterials(function() {
            getStateTestQuestions(function() {
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

  var query = Lesson.findById(id).populate('user', 'firstName displayName email profileImageURL username')
  .populate('unit', 'title color icon').populate('units', 'title color icon');

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
    .populate('materialsResources.vocabulary')
    .populate('lessonOverview.subjectAreas');
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
          Team.findOne({ teamLead: req.user }).exec(function(err, team) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.lesson = lesson;
              req.lessonSaved = (savedLesson) ? true : false;
              req.team = team;
              next();
            }
          });

        }
      });
    } else {
      req.lesson = lesson;
      next();
    }
  });
};
