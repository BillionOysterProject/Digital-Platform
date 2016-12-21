'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserActivity = mongoose.model('UserActivity'),
  Unit = mongoose.model('Unit'),
  Lesson = mongoose.model('Lesson'),
  SavedLesson = mongoose.model('SavedLesson'),
  LessonActivity = mongoose.model('LessonActivity'),
  Glossary = mongoose.model('Glossary'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  lodash = require('lodash');

/**
 * Calculate metrics related to people using the system
 */
exports.getPeopleMetrics = function(req, res) {
  var peopleMetrics = {};

  var userCountQuery = User.count({
    $or: [
      { pending: false },
      { pending: { $exists: false } }
    ] }
  );

  var adminCountQuery = User.count({
    $and: [
      { roles: 'admin' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  var teamLeadCountQuery = User.count({
    $and: [
      { roles: 'team lead' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  var teamMemberCountQuery = User.count({
    $and: [
      { roles: 'team member' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  userCountQuery.exec(function(err, userCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      peopleMetrics.userCount = userCount;
      adminCountQuery.exec(function(err, adminCount) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          peopleMetrics.adminCount = adminCount;
          teamLeadCountQuery.exec(function(err, teamLeadCount) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              peopleMetrics.teamLeadCount = teamLeadCount;
              teamMemberCountQuery.exec(function(err, teamMemberCount) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  peopleMetrics.teamMemberCount = teamMemberCount;
                  res.json(peopleMetrics);
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.getMostActiveUsers = function(req, res) {
  var groupBy = {
    $group: {
      _id: {
        user: '$user',
        activity: '$activity'
      } ,
      loginCount: {
        $sum: 1
      }
    }
  };
  var match = {
    $match: {
      activity: 'login'
    }
  };
  var startDate, endDate;
  if(req.query.startDate) {
    startDate = moment(req.query.startDate).toDate();
  }
  if(req.query.endDate) {
    endDate = moment(req.query.endDate).toDate();
  }

  if(startDate !== null && startDate !== undefined &&
    endDate !== null && endDate !== undefined) {
    match.$match.created = {
      $gte: startDate,
      $lt: endDate
    };
  } else if(startDate !== null && startDate !== undefined) {
    match.$match.created = {
      $gte: startDate
    };
  } else if(endDate !== null && endDate !== undefined) {
    match.$match.created = {
      $lt: endDate
    };
  }

  var activeUsersQuery = UserActivity.aggregate([
    match, groupBy
  ]);
  activeUsersQuery.exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //TODO: figure out how to get user display name, teams (they are leads of? members of?)
      //number of members on the team, and the organization
      res.json(data);
    }
  });
};

/**
 * Calculate metrics about lessons and units on the system
 */
exports.getCurriculumMetrics = function(req, res) {
  var curriculumMetrics = {};

  var unitCountQuery = Unit.count({
    $or: [
      { status: 'published' },
      { status: { $exists: false } }
    ] }
  );

  //TODO: should this count lessons without statuses
  var lessonCountQuery = Lesson.count({ status: 'published' });

  var savedLessonCountQuery = SavedLesson.count({});

  var duplicatedLessonCountQuery = LessonActivity.count({ activity: 'duplicated' });

  var glossaryTermsCountQuery = Glossary.count({});

  var lessonApprovalCountQuery = Lesson.aggregate([
    { $match: { $or: [{ status: 'published' }, { status: 'returned' } ] } },
    { $group: { _id: '$status', statusCount: { $sum: 1 } } }
  ]);

  var lessonsPerUnitQuery = Lesson.aggregate([
     { $match: { status: 'published' } },
     { $group: { _id: '$unit', lessonCount: { $sum: 1 } } },
     { $lookup: { from: 'units', localField: '_id', foreignField: '_id', as: 'units' } },
     { $project: { _id: 1, lessonCount: 1, unit: { $arrayElemAt: ['$units', 0] } } }
  ]);

  var lessonsPerPeriodsQuery = Lesson.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$lessonOverview.classPeriods', lessonCount: { $sum: 1 } } }
  ]);

  var lessonsPerSettingQuery = Lesson.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$lessonOverview.setting', lessonCount: { $sum: 1 } } }
  ]);

  var lessonsPerSubjectAreaQuery = Lesson.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$lessonOverview.subjectAreas' },
    { $group: { _id: '$lessonOverview.subjectAreas', lessonCount: { $sum: 1 } } },
    { $lookup: { from: 'metasubjectareas', localField: '_id', foreignField: '_id', as: 'subjects' } },
    { $project: { _id: 1, lessonCount: 1, subject: { $arrayElemAt: ['$subjects', 0] } } }
  ]);

//TODO: how do we know if it's a video to get the video average??

  var lessonResourcesQuery = Lesson.aggregate([
    { $match: { status: 'published' } },
    { $project: {
      supplies: '$materialsResources.supplies',
      teacherResourcesLinks: '$materialsResources.teacherResourcesLinks',
      handouts: '$materialsResources.handoutsFileInput'
    } }
  ]);

  var mostViewedLessonsQuery = LessonActivity.aggregate([
    { $match: { activity: 'viewed' } },
    { $group: { _id: '$lesson', viewCount: { $sum: 1 } } },
    { $sort: { viewCount: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'lessons', localField: '_id', foreignField: '_id', as: 'lesson' } },
    { $project: { _id: '$_id', viewCount: '$viewCount', lesson: { $arrayElemAt: ['$lesson', 0] } } },
    { $lookup: { from: 'units', localField: 'lesson.unit', foreignField: '_id', as: 'unit' } },
    { $project: { _id: 1, viewCount: 1, lesson: 1, unit: { $arrayElemAt: ['$unit', 0] } } }
  ]);

  var mostViewedUnitsQuery = LessonActivity.aggregate([{ $match: { activity: 'viewed' } },
    { $lookup: { from: 'lessons', localField: 'lesson', foreignField: '_id', as: 'lesson' } },
    { $project: { _id: '$_id', lesson: { $arrayElemAt: ['$lesson', 0] } } },
    { $lookup: { from: 'units', localField: 'lesson.unit', foreignField: '_id', as: 'unit' } },
    { $project: { _id: 1, lesson: 1, unit: { $arrayElemAt: ['$unit', 0] } } },
    { $group: { _id: '$unit', viewCount: { $sum: 1 } } },
    { $sort: { viewCount: -1 } },
    { $limit: 5 },
    { $project: { _id: false, unit: '$_id', viewCount: 1 } }
  ]);

  unitCountQuery.exec(function(err, unitCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      curriculumMetrics.unitCount = unitCount;
      lessonCountQuery.exec(function(err, lessonCount) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          curriculumMetrics.lessonCount = lessonCount;
          savedLessonCountQuery.exec(function(err, savedLessonCount) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              curriculumMetrics.savedLessonCount = savedLessonCount;
              duplicatedLessonCountQuery.exec(function(err, duplicatedLessonCount) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  curriculumMetrics.duplicatedLessonCount = duplicatedLessonCount;
                  glossaryTermsCountQuery.exec(function(err, glossaryTermsCount) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      curriculumMetrics.glossaryTermsCount = glossaryTermsCount;
                      lessonApprovalCountQuery.exec(function(err, lessonApprovalData) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {
                          for(var i = 0; i < lessonApprovalData.length; i++) {
                            if(lessonApprovalData[i]._id === 'returned') {
                              curriculumMetrics.lessonsReturnedCount = lessonApprovalData[i].statusCount;
                            } else if(lessonApprovalData[i]._id === 'published') {
                              curriculumMetrics.lessonsPublishedCount = lessonApprovalData[i].statusCount;
                            }
                          }
                          lessonsPerUnitQuery.exec(function(err, lessonsPerUnitData) {
                            if (err) {
                              return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                              });
                            } else {
                              var unitLessonCounts = [];
                              for(var i = 0; i < lessonsPerUnitData.length; i++) {
                                unitLessonCounts.push({
                                  unit: lessonsPerUnitData[i].unit,
                                  lessonCount: lessonsPerUnitData[i].lessonCount
                                });
                              }
                              curriculumMetrics.unitLessonCounts = unitLessonCounts;
                              lessonsPerPeriodsQuery.exec(function(err, lessonPerPeriodsData) {
                                if (err) {
                                  return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                  });
                                } else {
                                  var lessonPeriodCounts = [];
                                  for(var i = 0; i < lessonPerPeriodsData.length; i++) {
                                    lessonPeriodCounts.push({
                                      periods: lessonPerPeriodsData[i]._id,
                                      lessonCount: lessonPerPeriodsData[i].lessonCount
                                    });
                                  }
                                  curriculumMetrics.lessonPeriodCounts = lessonPeriodCounts;
                                  lessonsPerSettingQuery.exec(function(err, lessonsPerSettingData) {
                                    if (err) {
                                      return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                      });
                                    } else {
                                      var lessonSettingCounts = [];
                                      for(var i = 0; i < lessonsPerSettingData.length; i++) {
                                        lessonSettingCounts.push({
                                          setting: lessonsPerSettingData[i]._id,
                                          lessonCount: lessonsPerSettingData[i].lessonCount
                                        });
                                      }
                                      curriculumMetrics.lessonSettingCounts = lessonSettingCounts;
                                      lessonsPerSubjectAreaQuery.exec(function(err, lessonsPerSubjectData) {
                                        if (err) {
                                          return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                                          });
                                        } else {
                                          var lessonSubjectCounts = [];
                                          for(var i = 0; i < lessonsPerSubjectData.length; i++) {
                                            lessonSubjectCounts.push({
                                              subject: lessonsPerSubjectData[i].subject,
                                              lessonCount: lessonsPerSubjectData[i].lessonCount
                                            });
                                          }
                                          curriculumMetrics.lessonSubjectCounts = lessonSubjectCounts;
                                          lessonResourcesQuery.exec(function(err, lessonResources) {
                                            if (err) {
                                              return res.status(400).send({
                                                message: errorHandler.getErrorMessage(err)
                                              });
                                            } else {
                                              var totalLessons = lessonResources.length;
                                              var totalSupplies = 0;
                                              var totalTeacherResourcesLinks = 0;
                                              var totalHandouts = 0;
                                              for(var i = 0; i < lessonResources.length; i++) {
                                                if(lessonResources[i].supplies !== null && lessonResources[i] !== undefined) {
                                                  totalSupplies += lessonResources[i].supplies.split('\n').length;
                                                }
                                                if(lessonResources[i].teacherResourcesLinks !== null && lessonResources[i].teacherResourcesLinks[i] !== undefined) {
                                                  totalTeacherResourcesLinks += lessonResources[i].teacherResourcesLinks.length;
                                                }
                                                if(lessonResources[i].handouts !== null && lessonResources[i].handouts[i] !== undefined) {
                                                  totalHandouts += lessonResources[i].handouts.length;
                                                }
                                              }
                                              curriculumMetrics.lessonResources = {};
                                              curriculumMetrics.lessonResources.suppliesAverage = (totalSupplies / totalLessons);
                                              curriculumMetrics.lessonResources.teacherResourcesLinksAverage = (totalTeacherResourcesLinks / totalLessons);
                                              curriculumMetrics.lessonResources.handoutsAverage = (totalHandouts / totalLessons);
                                              mostViewedLessonsQuery.exec(function(err, lessonViewData) {
                                                if (err) {
                                                  return res.status(400).send({
                                                    message: errorHandler.getErrorMessage(err)
                                                  });
                                                } else {
                                                  curriculumMetrics.lessonViewData = lessonViewData;
                                                  mostViewedUnitsQuery.exec(function(err, unitViewData) {
                                                    if (err) {
                                                      return res.status(400).send({
                                                        message: errorHandler.getErrorMessage(err)
                                                      });
                                                    } else {
                                                      curriculumMetrics.unitViewData = unitViewData;
                                                      res.json(curriculumMetrics);
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
            }
          });
        }
      });
    }
  });
};
