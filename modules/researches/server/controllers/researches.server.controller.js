'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Research = mongoose.model('Research'),
  Team = mongoose.model('Team'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  archiver = require('archiver'),
  request = require('request'),
  path = require('path'),
  multer = require('multer'),
  async = require('async'),
  moment = require('moment'),
  wkhtmltopdf = require('node-wkhtmltopdf'),
  config = require(path.resolve('./config/config'));

var validateResearch = function(research, successCallback, errorCallback) {
  var errorMessages = [];

  if (errorMessages.length > 0) {
    errorCallback(errorMessages);
  } else {
    successCallback(research);
  }
};

var checkRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var getTeammates = function(user, callback) {
  Team.find({ 'teamMembers': user }).exec(function(err, teams) {
    if (err) {
      callback(err);
    } else {
      var teammates = [];
      for (var i = 0; i < teams.length; i++) {
        teammates = teammates.concat(teams[i].teamMembers);
      }
      teammates = _.uniqWith(teammates, _.isEqual);
      var index = _.findIndex(teammates, function(m) {
        return m.toString() === user._id.toString();
      });
      if (index > -1) {
        teammates.splice(index, 1);
      }
      callback(null, teammates);
    }
  });
};

var getTeamMembers = function(user, callback) {
  Team.find({ $or: [{ 'teamLead': user },{ 'teamLeads': user }] }).exec(function(err, teams) {
    if (err) {
      callback(err);
    } else {
      var teamMembers = [];
      for (var i = 0; i < teams.length; i++) {
        teamMembers = teamMembers.concat(teams[i].teamMembers);
        console.log('teamMembers', teamMembers);
      }
      teamMembers = _.uniqWith(teamMembers, _.isEqual);
      console.log('final', teamMembers);
      callback(null, teamMembers);
    }
  });
};

var getOrganizationIdsByName = function(searchRe, callback) {
  SchoolOrg.find({ 'name': searchRe }).exec(function(err, orgs) {
    if (err) {
      callback(err);
    } else {
      var orgIds = [];
      for (var i = 0; i < orgs.length; i++) {
        orgIds.push(orgs[i]._id);
      }
      callback(null, orgIds);
    }
  });
};

var getAuthorIdsByName = function(searchRe, callback) {
  User.find([{ 'displayName': searchRe }, { 'firstName': searchRe }, { 'lastName': searchRe },
  { 'email': searchRe }, { 'username': searchRe }]).exec(function(err, users) {
    if (err) {
      callback(err);
    } else {
      var userIds = [];
      for (var i = 0; i < users.length; i++) {
        userIds.push(users[i]._id);
      }
      callback(null, userIds);
    }
  });
};

/**
 * Create a Research
 */
exports.create = function(req, res) {
  validateResearch(req.body,
  function(researchJSON) {
    var research = new Research(researchJSON);

    research.user = req.user;
    research.status = researchJSON.status || 'pending';

    var pattern = /^data:image\/[a-z]*;base64,/i;
    if (research.headerImage && research.headerImage.path && pattern.test(research.headerImage.path)) {
      research.headerImage.path = '';
    }

    research.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
        //
        // email.sendEmailTemplate(config.mailer.admin, 'A new lesson is pending approval', 'lesson_waiting', {
        //   TeamLeadName: req.user.displayName,
        //   LessonName: lesson.title,
        //   LinkLessonRequest: httpTransport + req.headers.host + '/library/user'
        // }, function(info) {
        //   res.json(lesson);
        // }, function(errorMessage) {
        //   res.json(lesson);
        // });

        res.jsonp(research);
      }
    });
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

/**
 * Show the current Research
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var research = req.research ? req.research.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  research.isCurrentUserOwner = req.user && research.user && research.user._id.toString() === req.user._id.toString();

  res.jsonp(research);
};

// /**
//  * Publish a lesson
//  */
// exports.publish = function(req, res) {
//   var lesson = req.lesson;
//
//   if (lesson) {
//     lesson.status = 'published';
//     lesson.returnedNotes = '';
//
//     lesson.save(function(err) {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       } else {
//         var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
//
//         email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been approved',
//         'lesson_approved', {
//           FirstName: lesson.user.firstName,
//           LessonName: lesson.title,
//           LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
//           LinkProfile: httpTransport + req.headers.host + '/settings/profile'
//         },
//         function(response) {
//           res.json(lesson);
//         }, function(errorMessage) {
//           return res.status(400).send({
//             message: errorMessage
//           });
//         });
//       }
//     });
//   } else {
//     return res.status(400).send({
//       message: 'Cannot update the lesson'
//     });
//   }
// };
//
// /**
//  * Return a lesson
//  */
// exports.return = function(req, res) {
//   var lesson = req.lesson;
//
//   if (lesson) {
//     lesson.status = 'returned';
//     lesson.returnedNotes = req.body.returnedNotes;
//
//     lesson.save(function(err) {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       } else {
//         var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
//
//         email.sendEmailTemplate(lesson.user.email, 'Your lesson ' + lesson.title + ' has been returned',
//         'lesson_returned', {
//           FirstName: lesson.user.firstName,
//           LessonName: lesson.title,
//           LessonReturnedNote: lesson.returnedNotes,
//           LinkLesson: httpTransport + req.headers.host + '/lessons/' + lesson._id,
//           LinkProfile: httpTransport + req.headers.host + '/settings/profile'
//         },
//         function(response) {
//           res.json(lesson);
//         }, function(errorMessage) {
//           return res.status(400).send({
//             message: errorMessage
//           });
//         });
//       }
//     });
//   } else {
//     return res.status(400).send({
//       message: 'Cannot update the lesson'
//     });
//   }
// };

/**
 * Update a Research
 */
exports.update = function(req, res) {
  var research = req.research;
  validateResearch(req.body,
  function(researchJSON) {
    if (research) {
      research = _.extend(research, researchJSON);
      research.status = researchJSON.status || 'pending';

      var pattern = /^data:image\/[a-z]*;base64,/i;
      if (research.headerImage && research.headerImage.path && pattern.test(research.headerImage.path)) {
        research.headerImage.path = '';
      }

      if (!research.updated) research.updated = [];
      research.updated.push(Date.now());

      research.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(research);
        }
      });
    } else {
      return res.status(400).send({
        message: 'Cannot update the research'
      });
    }
  }, function(errorMessages) {
    return res.status(400).send({
      message: errorMessages
    });
  });
};

// /**
//  * Feedback for a lesson
//  */
// exports.lessonFeedback = function(req, res) {
//   var lesson = req.lesson;
//   var user = req.user;
//
//   var lessonFeedback = new LessonFeedback(req.body.feedback);
//   lessonFeedback.user = user;
//   lessonFeedback.lesson = lesson;
//
//   lessonFeedback.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';
//       var subject = 'Feedback from ' + req.user.displayName + ' about your lesson ' + req.body.lesson.title;
//       var toList = [lesson.user.email, config.mailer.admin];
//
//       email.sendEmailTemplate(toList, subject,
//       'lesson_feedback', {
//         FirstName: req.body.lesson.user.firstName,
//         LessonFeedbackName: req.user.displayName,
//         LessonName: req.body.lesson.title,
//         LessonFeedbackNote: req.body.message,
//         LessonEffective: (lessonFeedback.lessonEffective) ? lessonFeedback.lessonEffective : 0,
//         LessonAlignWithCurriculumn: (lessonFeedback.lessonAlignWithCurriculumn) ? lessonFeedback.lessonAlignWithCurriculumn : 0,
//         LessonSupportScientificPractice: (lessonFeedback.lessonSupportScientificPractice) ? lessonFeedback.lessonSupportScientificPractice : 0,
//         LessonPreparesStudents: (lessonFeedback.lessonPreparesStudents) ? lessonFeedback.lessonPreparesStudents : 0,
//         HowLessonTaught: (lessonFeedback.howLessonTaught) ? lessonFeedback.howLessonTaught : '',
//         WhyLessonTaughtNow: (lessonFeedback.whyLessonTaughtNow) ? lessonFeedback.whyLessonTaughtNow : '',
//         WillTeachLessonAgain: (lessonFeedback.willTeachLessonAgain) ? lessonFeedback.willTeachLessonAgain : '',
//         LessonSummary: (lessonFeedback.additionalFeedback.lessonSummary) ? lessonFeedback.additionalFeedback.lessonSummary : '',
//         LessonObjectives: (lessonFeedback.additionalFeedback.lessonObjectives) ? lessonFeedback.additionalFeedback.lessonObjectives : '',
//         MaterialsResources: (lessonFeedback.additionalFeedback.materialsResources) ? lessonFeedback.additionalFeedback.materialsResources : '',
//         Preparation: (lessonFeedback.additionalFeedback.preparation) ? lessonFeedback.additionalFeedback.preparation : '',
//         Background: (lessonFeedback.additionalFeedback.background) ? lessonFeedback.additionalFeedback.background : '',
//         InstructionPlan: (lessonFeedback.additionalFeedback.instructionPlan) ? lessonFeedback.additionalFeedback.instructionPlan : '',
//         Standards: (lessonFeedback.additionalFeedback.standards) ? lessonFeedback.additionalFeedback.standards : '',
//         Other: (lessonFeedback.additionalFeedback.other) ? lessonFeedback.additionalFeedback.other : '',
//         LinkLesson: httpTransport + req.headers.host + '/lessons/' + req.body.lesson._id,
//         LinkProfile: httpTransport + req.headers.host + '/settings/profile'
//       },
//       function(response) {
//         res.json(lessonFeedback);
//       }, function(errorMessage) {
//         return res.status(400).send({
//           message: errorMessage
//         });
//       });
//     }
//   });
// };
//
// exports.listFeedbackForLesson = function(req, res) {
//   var lesson = req.lesson;
//
//   LessonFeedback.find({ lesson: lesson }).populate('lesson', 'title')
//   .populate('user', 'displayName email team profileImageURL').exec(function(err, feedback) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(feedback);
//     }
//   });
// };
//
// exports.feedbackForLesson = function(req, res) {
//   var lesson = req.lesson;
//
//   LessonFeedback.aggregate([
//     { $match: { lesson: lesson._id } },
//     { $group: {
//       _id: null,
//       lessonEffective: { $avg: '$lessonEffective' },
//       lessonAlignWithCurriculumn: { $avg: '$lessonAlignWithCurriculumn' },
//       lessonSupportScientificPractice: { $avg: '$lessonSupportScientificPractice' },
//       lessonPreparesStudents: { $avg: '$lessonPreparesStudents' }
//     } }
//   ], function(err, result) {
//     if (err) {
//       res.status(400).send({
//         message: 'Could not retrieve averages'
//       });
//     } else {
//       LessonFeedback.find({ lesson: lesson._id }).sort('-created').populate('user', 'displayName').exec(function(err1, feedbackList) {
//         if (err1) {
//           res.status(400).send({
//             message: 'Could not retrieve feedback'
//           });
//         } else {
//           //Get array of feedback
//           var howLessonTaughtFeedback = [];
//           var whyLessonTaughtNowFeedback = [];
//           var willTeachLessonAgainFeedback = [];
//           var lessonSummaryFeedback = [];
//           var lessonObjectivesFeedback = [];
//           var materialsResourcesFeedback = [];
//           var preparationFeedback = [];
//           var backgroundFeedback = [];
//           var instructionPlanFeedback = [];
//           var standardsFeedback = [];
//           var otherFeedback = [];
//           for (var i = 0; i < feedbackList.length; i++) {
//             var feedback = feedbackList[i];
//             var author = feedback.user.displayName;
//             var date = moment(feedback.created).format('MMMM D, YYYY');
//
//             if (feedback.howLessonTaught) howLessonTaughtFeedback.push({ author: author, date: date,
//               feedback: feedback.howLessonTaught });
//             if (feedback.whyLessonTaughtNow) whyLessonTaughtNowFeedback.push({ author: author, date: date,
//               feedback: feedback.whyLessonTaughtNow });
//             if (feedback.willTeachLessonAgain) willTeachLessonAgainFeedback.push({ author: author, date: date,
//               feedback: feedback.willTeachLessonAgain });
//             if (feedback.additionalFeedback.lessonSummary) lessonSummaryFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.lessonSummary });
//             if (feedback.additionalFeedback.lessonObjectives) lessonObjectivesFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.lessonObjectives });
//             if (feedback.additionalFeedback.materialsResources) materialsResourcesFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.materialsResources });
//             if (feedback.additionalFeedback.preparation) preparationFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.preparation });
//             if (feedback.additionalFeedback.background) backgroundFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.background });
//             if (feedback.additionalFeedback.instructionPlan) instructionPlanFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.instructionPlan });
//             if (feedback.additionalFeedback.standards) standardsFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.standards });
//             if (feedback.additionalFeedback.other) otherFeedback.push({ author: author, date: date,
//               feedback: feedback.additionalFeedback.other });
//           }
//
//           res.json({
//             lessonEffectiveAvg: (result[0]) ? result[0].lessonEffective : 0,
//             lessonAlignWithCurriculumnAvg: (result[0]) ? result[0].lessonAlignWithCurriculumn : 0,
//             lessonSupportScientificPracticeAvg: (result[0]) ? result[0].lessonSupportScientificPractice : 0,
//             lessonPreparesStudentsAvg: (result[0]) ? result[0].lessonPreparesStudents : 0,
//             howLessonTaughtFeedback: howLessonTaughtFeedback,
//             whyLessonTaughtNowFeedback: whyLessonTaughtNowFeedback,
//             willTeachLessonAgainFeedback: willTeachLessonAgainFeedback,
//             lessonSummaryFeedback: lessonSummaryFeedback,
//             lessonObjectivesFeedback: lessonObjectivesFeedback,
//             materialsResourcesFeedback: materialsResourcesFeedback,
//             preparationFeedback: preparationFeedback,
//             backgroundFeedback: backgroundFeedback,
//             instructionPlanFeedback: instructionPlanFeedback,
//             standardsFeedback: standardsFeedback,
//             otherFeedback: otherFeedback
//           });
//         }
//       });
//     }
//   });
// };

/**
 * Delete an Research
 */
var deleteInternal = function(research, successCallback, errorCallback) {
  var filesToDelete = [];
  if (research) {
    if (research.headerImage && research.headerImage.path) {
      filesToDelete.push(research.headerImage.path);
    }

    if (filesToDelete.length > 0) {
      var uploadRemote = new UploadRemote();
      uploadRemote.deleteRemote(filesToDelete,
      function() {
        research.remove(function(err) {
          if (err) {
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(research);
          }
        });
      }, function(err) {
        errorCallback(err);
      });
    } else {
      research.remove(function(err) {
        if (err) {
          errorCallback(errorHandler.getErrorMessage(err));
        } else {
          successCallback(research);
        }
      });
    }
  }
};

exports.delete = function(req, res) {
  var research = req.research;

  deleteInternal(research,
  function(research) {
    res.json(research);
  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });
};

/**
 * List of Researches
 */
exports.list = function(req, res) {
  var search = function(searchStringOr, teammates) {
    var query;
    var and = [];

    if (req.query.byCreator) {
      if (req.query.byCreator === 'true') {
        and.push({ 'user': req.user });
      } else {
        and.push({ 'user': req.query.byCreator });
      }
    }

    if (teammates) {
      console.log('teammates', teammates);
      and.push({ 'user': { $in: teammates } });
    }

    if (req.query.status) {
      if (req.query.status === 'pending') {
        console.log('pending');
        and.push({ 'status': 'pending' });
      } else if (req.query.status === 'published') {
        and.push({ 'status': 'published' });
      } else if (req.query.status === 'draft') {
        and.push({ 'status': 'draft' });
      }
    }

    if (searchStringOr) {
      console.log('searchStringOr', searchStringOr);
      and.push({ $or: searchStringOr });
    }

    console.log('and', and);
    if (and.length === 1) {
      query = Research.find(and[0]);
    } else if (and.length > 0) {
      query = Research.find({ $and: and });
    } else {
      query = Research.find();
    }

    if (req.query.sort) {
      if (req.query.sort === 'owner') {
        query.sort({ 'user.lastName': 1 });
      } else if (req.query.sort === 'title') {
        query.sort({ 'title': 1 });
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

    query.populate('user', 'displayName firstName lastName email profileImageURL username schoolOrg').exec(function(err, researches) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        async.forEach(researches, function(item,callback) {
          SchoolOrg.populate(item.user, { 'path': 'schoolOrg' }, function(err, output) {
            if (err) {
              return res.status(400).send({
                message: err
              });
            } else {
              callback();
            }
          });
        }, function(err) {
          res.json(researches);
        });
      }
    });
  };

  var getSearchStringOr = function(callback) {
    var or = [];
    var searchRe;
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'title': searchRe });
    or.push({ 'intro': searchRe });
    or.push({ 'methods': searchRe });
    or.push({ 'results': searchRe });
    or.push({ 'discussion': searchRe });
    or.push({ 'cited': searchRe });
    or.push({ 'methods': searchRe });
    or.push({ 'other.title': searchRe });
    or.push({ 'other.cited': searchRe });

    getOrganizationIdsByName(searchRe, function() {
      getAuthorIdsByName(searchRe, function() {
        callback(or, searchRe);
      });
    });
  };

  var findBySearchString = function(callback) {
    if (req.query.searchString) {
      console.log('searchString', req.query.searchString);
      getSearchStringOr(function(or, searchRe) {
        callback(or);
      });
    } else {
      callback();
    }
  };

  var findByTeammates = function(callback) {
    if (req.query.byTeammates) {
      getTeammates(req.user, function(err, teammates) {
        callback(teammates);
      });
    } else if (req.query.byTeamMembers) {
      getTeamMembers(req.user, function(err, teamMembers) {
        console.log('teamMembers', teamMembers);
        callback(teamMembers);
      });
    } else {
      callback();
    }
  };

  findBySearchString(function(or) {
    console.log('or', or);
    findByTeammates(function(teammates) {
      search(or, teammates);
    });
  });
};

/**
 * Downloads
 */
exports.download = function(req, res) {
  var options = [
    '--quiet',
    //'--cookie connect.sid ' + connectSid,
    '--margin-bottom 1',
    '--margin-left 1',
    '--margin-right 1',
    '--margin-top 1',
    '--orientation Portrait',
    '--page-size A4',
    '--disable-smart-shrinking',
    '--zoom 1.5'
  ];

  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  var input = httpTransport + req.headers.host + '/full-page/research/' + req.research._id;

  var doc = wkhtmltopdf(options, input);

  doc.stdout.pipe(res);

  res.writeHead(200, {
    'Content-Type': 'application/pdf, application/octet-stream',
    'Content-Disposition': 'attachment; filename=' + req.query.filename
  });
};

/**
 * Uploads
 */
var uploadFileSuccess = function(research, res) {
  research.save(function(saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      res.json(research);
    }
  });
};

var uploadFileError = function(research, errorMessage, res) {
  return res.status(400).send({
    message: errorMessage
  });
};

exports.uploadHeaderImage = function (req, res) {
  var research = req.research;
  var upload = multer(config.uploads.researchHeaderImageUpload).single('newHeaderImage');
  var headerImageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = headerImageUploadFileFilter;

  if (research) {
    var uploadRemote = new UploadRemote();
    uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.researchHeaderImageUpload,
    function(fileInfo) {
      research.headerImage = fileInfo;

      uploadFileSuccess(research, res);
    }, function(errorMessage) {
      uploadFileError(research, errorMessage, res);
    });
  } else {
    res.status(400).send({
      message: 'Research does not exist'
    });
  }
};

// exports.downloadFile = function(req, res){
//   res.setHeader('Content-disposition', 'attachment;');
//   res.setHeader('content-type', req.query.mimetype);
//
//   request(req.query.path).pipe(res);
// };

/**
 * Research middleware
 */
exports.researchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Research is invalid'
    });
  }

  Research.findById(id).populate('user', 'displayName firstName lastName email profileImageURL username').exec(function (err, research) {
    if (err) {
      return next(err);
    } else if (!research) {
      return res.status(404).send({
        message: 'No Research with that identifier has been found'
      });
    }
    req.research = research;
    next();
  });
};
