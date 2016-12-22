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
  RestorationStation = mongoose.model('RestorationStation'),
  Expedition = mongoose.model('Expedition'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
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
  var activityMatch = { $match: { activity: 'login' } };
  var startDate, endDate;
  if(req.query.startDate) {
    startDate = moment(req.query.startDate).toDate();
  }
  if(req.query.endDate) {
    endDate = moment(req.query.endDate).toDate();
  }

  if(startDate !== null && startDate !== undefined &&
    endDate !== null && endDate !== undefined) {
    activityMatch.$match.created = {
      $gte: startDate,
      $lt: endDate
    };
  } else if(startDate !== null && startDate !== undefined) {
    activityMatch.$match.created = {
      $gte: startDate
    };
  } else if(endDate !== null && endDate !== undefined) {
    activityMatch.$match.created = {
      $lt: endDate
    };
  }

  var userRolesMatch = { $match: { 'user.roles' : 'team lead' } };
  if(req.query.userRole !== null && req.query.userRole !== undefined) {
    //{ $match: { 'user.roles': 'team lead' } },
    userRolesMatch = { $match: { 'user.roles': req.query.userRole } };
  }

  var activeUsersQuery = UserActivity.aggregate([
    activityMatch,
    { $group: { _id: { user: '$user', activity: '$activity' }, loginCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id.user', foreignField: '_id', as: 'users' } },
    { $project: { _id: false, user: { $arrayElemAt: ['$users', 0] }, loginCount: 1 } },
    userRolesMatch,
    { $sort: { loginCount: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'schoolorgs', localField: 'user.schoolOrg', foreignField: '_id', as: 'schoolOrgs' } },
    { $project: { _id: false, loginCount: 1, user: 1, schoolOrg: { $arrayElemAt: [ '$schoolOrgs', 0 ] } } },
    { $lookup: { from: 'teams', localField: 'user._id', foreignField: 'teamMembers', as: 'teams' } }
  ]);

  activeUsersQuery.exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(data);
    }
  });
};

/**
 * Calculate metrics about lessons and units on the system
 */
exports.getCurriculumMetrics = function(req, res) {
  var curriculumMetrics = {};

  var unitCountQuery = Unit.count({ $or: [ { status: 'published' }, { status: { $exists: false } } ] });

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

//this doesn't do cumulative totals or fill in anything for months
//where no units/lessons were created - will do this after the query
  var createdUnitsByMonthQuery = Unit.aggregate([
    { $sort: { created: -1 } },
    { $group: { _id: { month: { $month: '$created' }, year: { $year: '$created' } },
      unitCount: { $sum: 1 } } }
  ]);
  var createdLessonsByMonthQuery = Lesson.aggregate([
    { $sort: { created: -1 } },
    { $group: { _id: { month: { $month: '$created' }, year: { $year: '$created' } },
      lessonCount: { $sum: 1 } } }
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

exports.getStationMetrics = function(req, res) {
  var stationMetrics = {};

  var stationCountQuery = RestorationStation.count({});
  var stationCountsByStatusQuery = RestorationStation.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  var expeditionCountQuery = Expedition.count({});

  var protocolMobileTrapStatusQuery = ProtocolMobileTrap.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  var protocolOysterMeasurementStatusQuery = ProtocolOysterMeasurement.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  var protocolSettlementTileStatusQuery = ProtocolSettlementTile.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  var protocolSiteConditionStatusQuery = ProtocolSiteCondition.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  var protocolWaterQualityStatusQuery = ProtocolWaterQuality.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  stationMetrics.protocolStatuses = { incomplete: 0, submitted: 0, returned: 0, published: 0, unpublished: 0 };

  stationCountQuery.exec(function(err, stationCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      stationMetrics.stationCount = stationCount;
      stationCountsByStatusQuery.exec(function(err, statusCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          stationMetrics.activeStationCount = 0;
          stationMetrics.lostStationCount = 0;
          for(var i = 0; i < statusCounts.length; i++) {
            if(statusCounts[i]._id === 'Active') {
              stationMetrics.activeStationCount = statusCounts[i].count;
            } else if(statusCounts[i]._id === 'Lost') {
              stationMetrics.lostStationCount = statusCounts[i].count;
            }
          }
          expeditionCountQuery.exec(function(err, expeditionCount) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              stationMetrics.expeditionCount = expeditionCount;
              protocolMobileTrapStatusQuery.exec(function(err, protocolStatusCount) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  for(var i = 0; i < protocolStatusCount.length; i++) {
                    stationMetrics.protocolStatuses[protocolStatusCount[i]._id] =
                      stationMetrics.protocolStatuses[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                  }
                  protocolOysterMeasurementStatusQuery.exec(function(err, protocolStatusCount) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {

                      for(var i = 0; i < protocolStatusCount.length; i++) {
                        stationMetrics.protocolStatuses[protocolStatusCount[i]._id] =
                          stationMetrics.protocolStatuses[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                      }
                      protocolSettlementTileStatusQuery.exec(function(err, protocolStatusCount) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {

                          for(var i = 0; i < protocolStatusCount.length; i++) {
                            stationMetrics.protocolStatuses[protocolStatusCount[i]._id] =
                              stationMetrics.protocolStatuses[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                          }
                          protocolSiteConditionStatusQuery.exec(function(err, protocolStatusCount) {
                            if (err) {
                              return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                              });
                            } else {

                              for(var i = 0; i < protocolStatusCount.length; i++) {
                                stationMetrics.protocolStatuses[protocolStatusCount[i]._id] =
                                  stationMetrics.protocolStatuses[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                              }
                              protocolWaterQualityStatusQuery.exec(function(err, protocolStatusCount) {
                                if (err) {
                                  return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                  });
                                } else {

                                  for(var i = 0; i < protocolStatusCount.length; i++) {
                                    stationMetrics.protocolStatuses[protocolStatusCount[i]._id] =
                                      stationMetrics.protocolStatuses[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                                  }
                                  res.json(stationMetrics);
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
