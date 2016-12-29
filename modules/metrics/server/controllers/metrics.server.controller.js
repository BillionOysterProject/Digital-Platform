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

//TODO: I think the grades should be stored as an array of numbers rather than
//strings that are tied directly to the UI.
var calculateLessonsPerGrade = function(lessonList) {
  var lessonsPerGrade = {
    '6th': 0, '7th': 0, '8th': 0, '9th': 0, '10th': 0, '11th': 0, '12th': 0
  };
  for(var i = 0; i < lessonList.length; i++) {
    var lesson = lessonList[i];
    if(lesson.lessonOverview !== null && lesson.lessonOverview !== undefined &&
      lesson.lessonOverview.grade !== null && lesson.lessonOverview.grade !== undefined) {
      var grade = lesson.lessonOverview.grade.trim();
      //grade could be a single value like '6th' or a range like '9th - 12th'
      //even worse, it's '9th - 12th' but '6 - 8th'. Ugh!
      if(grade.indexOf('-') < 0) {
        if(grade.indexOf('th') < 0) {
          grade = grade + 'th';
        }
        lessonsPerGrade[grade] += 1;
      } else {
        var gradeArr = grade.split('-');
        var firstGrade = gradeArr[0].trim();
        var firstGradeNum = 0;
        if(firstGrade.indexOf('th') >= 0) {
          firstGradeNum = firstGrade.substr(0, firstGrade.indexOf('th')).trim();
        } else {
          firstGradeNum = firstGrade;
        }
        var lastGrade = gradeArr[1].trim();
        var lastGradeNum = 0;
        if(lastGrade.indexOf('th') >= 0) {
          lastGradeNum = lastGrade.substr(0, lastGrade.indexOf('th')).trim();
        } else {
          lastGradeNum = lastGrade;
        }
        if(firstGradeNum < lastGradeNum) {
          while(firstGradeNum <= lastGradeNum) {
            lessonsPerGrade[firstGradeNum+'th'] += 1;
            firstGradeNum++;
          }
        } else {
          lessonsPerGrade[firstGradeNum+'th'] += 1;
        }
      }
    }
  }
  return lessonsPerGrade;
};

/**
 * Calculate metrics about lessons and units on the system
 */
exports.getCurriculumMetrics = function(req, res) {
  var curriculumMetrics = {};

  var unitCountQuery = Unit.aggregate([
    //not matching on status exists because some old units in the local db have no status
    { $group: { _id: '$status', statusCount: { $sum: 1 } } },
    { $project: { _id: false, status: '$_id', count: '$statusCount' } }
  ]);

  var lessonsQuery = Lesson.aggregate([
    { $match: { status: { $exists: true } } },
    { $group: { _id: '$status', statusCount: { $sum: 1 } } },
    { $project: { _id: false, status: '$_id', count: '$statusCount' } }
  ]);

  var savedLessonCountQuery = SavedLesson.count({});

  var duplicatedLessonCountQuery = LessonActivity.count({ activity: 'duplicated' });

  var glossaryTermsCountQuery = Glossary.count({});

  //can't make a good query to calculate the grades so getting all published lessons
  //and doing the rest in the controller
  var lessonsPerGradeQuery = Lesson.find({ status: 'published' });

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

  unitCountQuery.exec(function(err, unitCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      curriculumMetrics.unitCounts = {
        draft: 0,
        published: 0
      };
      for(var i = 0; i < unitCounts.length; i++) {
        if(unitCounts[i].status === null) {
          curriculumMetrics.unitCounts.published += unitCounts[i].count;
        } else {
          curriculumMetrics.unitCounts[unitCounts[i].status] += unitCounts[i].count;
        }
      }
      lessonsQuery.exec(function(err, lessonCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          curriculumMetrics.lessonCounts = {
            draft: 0,
            returned: 0,
            pending: 0,
            published: 0,
            duplicated: 0,
            saved: 0
          };
          for(var i = 0; i < lessonCounts.length; i++) {
            curriculumMetrics.lessonCounts[lessonCounts[i].status] = lessonCounts[i].count;
          }
          savedLessonCountQuery.exec(function(err, savedLessonCount) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              curriculumMetrics.lessonCounts.saved = savedLessonCount;
              duplicatedLessonCountQuery.exec(function(err, duplicatedLessonCount) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  curriculumMetrics.lessonCounts.duplicated = duplicatedLessonCount;
                  glossaryTermsCountQuery.exec(function(err, glossaryTermsCount) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      curriculumMetrics.glossaryTermsCount = glossaryTermsCount;
                      lessonsPerGradeQuery.exec(function(err, lessonData) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {
                          //figure out the grade breakdown
                          curriculumMetrics.lessonsPerGrade = calculateLessonsPerGrade(lessonData);
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
  var expeditionsCompleteQuery = Expedition.aggregate([
    { $group: { _id: { $gt: [ '$monitoringStartDate', new Date()] }, count: { $sum: 1 } } },
    { $project: { _id: false, future: '$_id', count: 1 } }
  ]);
  var mostVisitedStationsQuery = Expedition.aggregate([
    { $group: { _id: '$station', expeditionCount: { $sum: 1 } } },
    { $sort: { expeditionCount: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'restorationstations', localField: '_id', foreignField: '_id', as: 'stations' } },
    { $project: { _id: false, expeditionCount: 1, station: { $arrayElemAt: ['$stations', 0] } } }
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
              stationMetrics.expeditions = {
                totalCount: 0,
                futureCount: 0,
                completedCount: 0
              };
              stationMetrics.expeditions.totalCount = expeditionCount;
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
                                  expeditionsCompleteQuery.exec(function(err, expeditionData) {
                                    if (err) {
                                      return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                      });
                                    } else {
                                      for(var i = 0; i < expeditionData.length; i++) {
                                        if(expeditionData[i].future === false) {
                                          stationMetrics.expeditions.completedCount = expeditionData[i].count;
                                        } else if(expeditionData[i].future === true) {
                                          stationMetrics.expeditions.futureCount = expeditionData[i].count;
                                        }
                                      }
                                      mostVisitedStationsQuery.exec(function(err, stationVisitCountData) {
                                        if (err) {
                                          return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                                          });
                                        } else {
                                          stationMetrics.stationVisitCounts = stationVisitCountData;
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
        }
      });
    }
  });
};

var calculateMonthTimeIntervals = function(numMonths) {
  var monthTimeIntervals = [];
  var prevMonth = moment().subtract(numMonths-1, 'months').startOf('month');
  var nextMonth = moment().add(1, 'months').startOf('month');
  while(prevMonth.get('month') !== nextMonth.get('month') ||
        prevMonth.get('year') !== nextMonth.get('year')) {
    monthTimeIntervals.push({
      start: prevMonth.startOf('month').toDate(),
      end: prevMonth.endOf('month').toDate()
    });
    prevMonth = prevMonth.add(1, 'months');
  }
  return monthTimeIntervals;
};

exports.getMonthlyUnitCounts = function(req, res) {
  var monthTimeIntervals = calculateMonthTimeIntervals(req.query.months ? req.query.months : 12);
  function queryByTimeInterval(metrics, timeIntervalArray, currIndex) {
    if(currIndex === timeIntervalArray.length) {
      res.json(metrics);
      return;
    }
    var unitCountsByTimeInterval = Unit.count({
      $and: [
        { created: { $lte: timeIntervalArray[currIndex].end } },
        { $or: [ { status: 'published' }, { status: { $exists: false } } ] }
      ]
    });
    unitCountsByTimeInterval.exec(function(err, unitCount) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        metrics.push(unitCount);
        queryByTimeInterval(metrics, timeIntervalArray, currIndex+1);
      }
    });
  }

  var metricsResults = [];
  queryByTimeInterval(metricsResults, monthTimeIntervals, 0);
};

exports.getMonthlyLessonCounts = function(req, res) {
  var monthTimeIntervals = calculateMonthTimeIntervals(req.query.months ? req.query.months : 12);

  function queryByTimeInterval(metrics, timeIntervalArray, currIndex) {
    if(currIndex === timeIntervalArray.length) {
      res.json(metrics);
      return;
    }
    //TODO: should this count lessons without statuses
    var lessonCountsByTimeInterval = Lesson.count({
      $and: [
        { created: { $lte: timeIntervalArray[currIndex].end } },
        { status: 'published' }
      ]
    });
    lessonCountsByTimeInterval.exec(function(err, lessonCount) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        metrics.push(lessonCount);
        queryByTimeInterval(metrics, timeIntervalArray, currIndex+1);
      }
    });
  }

  var metricsResults = [];
  queryByTimeInterval(metricsResults, monthTimeIntervals, 0);
};

/**
gets the number of active stations per month for the last N months
**/
exports.getMonthlyStationCounts = function(req, res) {
  var monthTimeIntervals = calculateMonthTimeIntervals(req.query.months ? req.query.months : 12);

  function queryByTimeInterval(metrics, timeIntervalArray, currIndex) {
    if(currIndex === timeIntervalArray.length) {
      res.json(metrics);
      return;
    }
    var stationCountsByTimeInterval = RestorationStation.count({
      $and: [
        { created: { $lte: timeIntervalArray[currIndex].end } },
        { status: 'Active' }
      ]
    });
    stationCountsByTimeInterval.exec(function(err, activeStations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        metrics.push(activeStations);
        queryByTimeInterval(metrics, timeIntervalArray, currIndex+1);
      }
    });
  }

  var metricsResults = [];
  queryByTimeInterval(metricsResults, monthTimeIntervals, 0);
};

/**
gets the number of expeditions that occur each month for the last N months
**/
exports.getMonthlyExpeditionCounts = function(req, res) {
  var monthTimeIntervals = calculateMonthTimeIntervals(req.query.months ? req.query.months : 12);

  function queryByTimeInterval(metrics, timeIntervalArray, currIndex) {
    if(currIndex === timeIntervalArray.length) {
      res.json(metrics);
      return;
    }
    var expeditionCountsByTimeInterval = Expedition.count({
      $or: [
        { $and: [
          { monitoringStartDate: { $gte: timeIntervalArray[currIndex].start } },
          { monitoringStartDate: { $lte: timeIntervalArray[currIndex].end } }
        ] },
        { $and: [
          { monitoringEndDate: { $gte: timeIntervalArray[currIndex].start } },
          { monitoringEndDate: { $lte: timeIntervalArray[currIndex].end } }
        ] }
      ]
    });
    expeditionCountsByTimeInterval.exec(function(err, expeditionCount) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        metrics.push(expeditionCount);
        queryByTimeInterval(metrics, timeIntervalArray, currIndex+1);
      }
    });
  }

  var metricsResults = [];
  queryByTimeInterval(metricsResults, monthTimeIntervals, 0);
};
