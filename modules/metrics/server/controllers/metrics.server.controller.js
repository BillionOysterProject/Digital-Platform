'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserActivity = mongoose.model('UserActivity'),
  Team = mongoose.model('Team'),
  Unit = mongoose.model('Unit'),
  Lesson = mongoose.model('Lesson'),
  SavedLesson = mongoose.model('SavedLesson'),
  LessonActivity = mongoose.model('LessonActivity'),
  UnitActivity = mongoose.model('UnitActivity'),
  Glossary = mongoose.model('Glossary'),
  RestorationStation = mongoose.model('RestorationStation'),
  Expedition = mongoose.model('Expedition'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  MetaEventType = mongoose.model('MetaEventType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  statsHandler = require(path.resolve('./modules/metrics/server/helpers/metrics.server.helper')),
  archiver = require('archiver'),
  _ = require('lodash'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  lodash = require('lodash'),
  json2csv = require('json2csv');

var userCountQuery = User.count({
  $or: [ { pending: false }, { pending: { $exists: false } } ]
});

var teamLeadCountQuery = User.count({
  $and: [
    { roles: 'team lead' }, { roles: { $nin: ['admin', 'team lead pending'] } },
    { $or: [ { pending: false }, { pending: { $exists: false } } ] }
  ]
});

var teamMemberCountQuery = User.count({
  $and: [
    { roles: 'team member' }, { roles: { $nin: ['team member pending'] } },
    { $or: [ { pending: false }, { pending: { $exists: false } } ] }
  ]
});

var largestTeamsQuery = Team.aggregate([
  { $match: { teamMembers: { $exists: true } } },
  { $project: { id: 1, name: 1, teamLeads: 1, schoolOrg: 1, teamMemberCount: { $size: '$teamMembers' } } },
  { $sort: { teamMemberCount: -1 } },
  { $limit: 5 },
  { $lookup: { from: 'schoolorgs', localField: 'schoolOrg', foreignField: '_id', as: 'schoolOrgs' } },
  { $project: { id: 1, name: 1, teamLeads: 1, teamMemberCount: 1, schoolOrg: { $arrayElemAt: [ '$schoolOrgs', 0 ] } } },
  { $unwind: '$teamLeads' },
  { $lookup: { from: 'users', localField: 'teamLeads', foreignField: '_id', as: 'teamLeadsLookup' } },
  { $group: {
    _id: '$_id',
    teamLeads: { $push: { $arrayElemAt: [ '$teamLeadsLookup', 0 ] } },
    name: { $first: '$name' },
    teamMemberCount: { $first: '$teamMemberCount' },
    schoolOrg: { $first: '$schoolOrg' }
  } }
]);

exports.getPeopleMetrics = function(req, res) {
  var peopleMetrics = {};
  var userCounts = { total: 0, teamLead: 0, teamMember: 0 };

  userCountQuery.exec(function(err, userCount) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting user counts:' + errorHandler.getErrorMessage(err)
      });
    } else {
      userCounts.total = userCount;
      teamLeadCountQuery.exec(function(err, teamLeadCount) {
        if (err) {
          return res.status(400).send({
            message: 'Error getting team lead counts:' + errorHandler.getErrorMessage(err)
          });
        } else {
          userCounts.teamLead = teamLeadCount;
          teamMemberCountQuery.exec(function(err, teamMemberCount) {
            if (err) {
              return res.status(400).send({
                message: 'Error getting team member counts:' + errorHandler.getErrorMessage(err)
              });
            } else {
              userCounts.teamMember = teamMemberCount;
              peopleMetrics.userCounts = userCounts;
              largestTeamsQuery.exec(function(err, largestTeams) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting largest teams:' + errorHandler.getErrorMessage(err)
                  });
                } else {
                  peopleMetrics.largestTeams = largestTeams;
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

exports.getPeopleMetricsAdmin = function(req, res) {
  var peopleMetrics = {};
  var adminCountQuery = User.count({
    $and: [
      { roles: 'admin' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  var userCounts = { total: 0, teamLead: 0, teamMember: 0, admin: 0 };

  userCountQuery.exec(function(err, userCount) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting user counts:' + errorHandler.getErrorMessage(err)
      });
    } else {
      userCounts.total = userCount;
      teamLeadCountQuery.exec(function(err, teamLeadCount) {
        if (err) {
          return res.status(400).send({
            message: 'Error getting team lead counts:' + errorHandler.getErrorMessage(err)
          });
        } else {
          userCounts.teamLead = teamLeadCount;
          teamMemberCountQuery.exec(function(err, teamMemberCount) {
            if (err) {
              return res.status(400).send({
                message: 'Error getting team member counts:' + errorHandler.getErrorMessage(err)
              });
            } else {
              userCounts.teamMember = teamMemberCount;
              peopleMetrics.userCounts = userCounts;
              largestTeamsQuery.exec(function(err, largestTeams) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting largest teams:' + errorHandler.getErrorMessage(err)
                  });
                } else {
                  peopleMetrics.largestTeams = largestTeams;
                  adminCountQuery.exec(function(err, adminCount) {
                    if (err) {
                      return res.status(400).send({
                        message: 'Error getting admin user count:' + errorHandler.getErrorMessage(err)
                      });
                    } else {
                      peopleMetrics.userCounts.admin = adminCount;
                      res.json(peopleMetrics);
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

  var userRoleMatch = { $match: { 'user.roles': 'admin' } };
  var teamLookup = null;
  if(req.query.userRole === 'team member') {
    userRoleMatch = { $match: { $and: [{ 'user.roles': 'team member' }, { 'user.roles': { $nin: ['team member pending'] } }] } };
    teamLookup = { $lookup: { from: 'teams', localField: 'user._id', foreignField: 'teamMembers', as: 'teams' } };
  } else if(req.query.userRole === 'team lead') {
    userRoleMatch = { $match: { $and: [{ 'user.roles': 'team lead' }, { 'user.roles': { $nin: ['admin', 'team lead pending'] } }] } };
    teamLookup = { $lookup: { from: 'teams', localField: 'user._id', foreignField: 'teamLeads', as: 'teams' } };
  }

  var activeUsersQuery = null;
  if(req.query.userRole === 'team lead' || req.query.userRole === 'team member') {
    activeUsersQuery = UserActivity.aggregate([
      activityMatch,
      { $group: { _id: { user: '$user', activity: '$activity' }, loginCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id.user', foreignField: '_id', as: 'users' } },
      { $project: { _id: false, user: { $arrayElemAt: ['$users', 0] }, loginCount: 1 } },
      userRoleMatch,
      { $sort: { loginCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'schoolorgs', localField: 'user.schoolOrg', foreignField: '_id', as: 'schoolOrgs' } },
      { $project: { _id: false, loginCount: 1, user: 1, schoolOrg: { $arrayElemAt: [ '$schoolOrgs', 0 ] } } },
      teamLookup
    ]);
  } else {
    //admin doesn't have org or team lookups
    activeUsersQuery = UserActivity.aggregate([
      activityMatch,
      { $group: { _id: { user: '$user', activity: '$activity' }, loginCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id.user', foreignField: '_id', as: 'users' } },
      { $project: { _id: false, user: { $arrayElemAt: ['$users', 0] }, loginCount: 1 } },
      userRoleMatch,
      { $sort: { loginCount: -1 } },
      { $limit: 5 }
    ]);
  }

  activeUsersQuery.exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting active users: ' + errorHandler.getErrorMessage(err)
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
     { $match: { 'units.0': { $exists: true } } },
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
    { $match: { 'subjects.0': { $exists: true } } },
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
    { $lookup: { from: 'lessons', localField: '_id', foreignField: '_id', as: 'lessons' } },
    { $match: { 'lessons.0': { $exists: true } } },
    { $project: { _id: '$_id', viewCount: '$viewCount', lesson: { $arrayElemAt: ['$lessons', 0] } } },
    { $lookup: { from: 'units', localField: 'lesson.unit', foreignField: '_id', as: 'unit' } },
    { $project: { _id: 1, viewCount: 1, lesson: 1, unit: { $arrayElemAt: ['$unit', 0] } } },
    { $sort: { viewCount: -1 } },
    { $limit: 5 }
  ]);

  var mostViewedUnitsQuery = UnitActivity.aggregate([{ $match: { activity: 'viewed' } },
    { $lookup: { from: 'units', localField: 'unit', foreignField: '_id', as: 'units' } },
    { $match: { 'units.0': { $exists: true } } },
    { $project: { _id: '$_id', unit: { $arrayElemAt: ['$units', 0] } } },
    { $group: { _id: '$unit', viewCount: { $sum: 1 } } },
    { $sort: { viewCount: -1 } },
    { $limit: 5 },
    { $project: { _id: false, unit: '$_id', viewCount: 1 } }
  ]);

  unitCountQuery.exec(function(err, unitCounts) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting unit count: ' + errorHandler.getErrorMessage(err)
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
            message: 'Error getting lesson counts: ' + errorHandler.getErrorMessage(err)
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
                message: 'Error getting saved lesson counts: ' + errorHandler.getErrorMessage(err)
              });
            } else {
              curriculumMetrics.lessonCounts.saved = savedLessonCount;
              duplicatedLessonCountQuery.exec(function(err, duplicatedLessonCount) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting duplicated lesson counts: ' + errorHandler.getErrorMessage(err)
                  });
                } else {
                  curriculumMetrics.lessonCounts.duplicated = duplicatedLessonCount;
                  glossaryTermsCountQuery.exec(function(err, glossaryTermsCount) {
                    if (err) {
                      return res.status(400).send({
                        message: 'Error getting glossary terms count: ' + errorHandler.getErrorMessage(err)
                      });
                    } else {
                      curriculumMetrics.glossaryTermsCount = glossaryTermsCount;
                      lessonsPerGradeQuery.exec(function(err, lessonData) {
                        if (err) {
                          return res.status(400).send({
                            message: 'Error getting lessons per grade: ' + errorHandler.getErrorMessage(err)
                          });
                        } else {
                          //figure out the grade breakdown
                          curriculumMetrics.lessonsPerGrade = calculateLessonsPerGrade(lessonData);
                          lessonsPerUnitQuery.exec(function(err, lessonsPerUnitData) {
                            if (err) {
                              return res.status(400).send({
                                message: 'Error getting lessons per unit: ' + errorHandler.getErrorMessage(err)
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
                                    message: 'Error getting lessons per period: ' + errorHandler.getErrorMessage(err)
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
                                        message: 'Error getting lessons per setting: ' + errorHandler.getErrorMessage(err)
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
                                            message: 'Error getting lessons per subject: ' + errorHandler.getErrorMessage(err)
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
                                                message: 'Error getting lesson resources: ' + errorHandler.getErrorMessage(err)
                                              });
                                            } else {
                                              var totalLessons = lessonResources.length;
                                              var totalSupplies = 0;
                                              var totalTeacherResourcesLinks = 0;
                                              var totalHandouts = 0;
                                              for(var i = 0; i < lessonResources.length; i++) {
                                                if(lessonResources[i].supplies !== null && lessonResources[i].supplies !== undefined) {
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
                                                    message: 'Error getting most viewed lessons: ' + errorHandler.getErrorMessage(err)
                                                  });
                                                } else {
                                                  curriculumMetrics.lessonViewData = lessonViewData;
                                                  mostViewedUnitsQuery.exec(function(err, unitViewData) {
                                                    if (err) {
                                                      return res.status(400).send({
                                                        message: 'Error getting most viewed units: ' + errorHandler.getErrorMessage(err)
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
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: false, status: { $toLower: '$_id' }, count: 1 } }
  ]);
  var expeditionCountQuery = Expedition.count({});
  var expeditionCountByStatusQuery = Expedition.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: false, status: '$_id', count: 1 } }
  ]);

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
    //{ $match: { status: 'published' } }, -- supposed to include all statuses
    { $group: { _id: { $gt: [ '$monitoringStartDate', new Date()] }, count: { $sum: 1 } } },
    { $project: { _id: false, future: '$_id', count: 1 } }
  ]);
  var mostVisitedStationsQuery = Expedition.aggregate([
    { $group: { _id: '$station', expeditionCount: { $sum: 1 } } },
    { $lookup: { from: 'restorationstations', localField: '_id', foreignField: '_id', as: 'stations' } },
    { $match: { 'stations.0': { $exists: true } } },
    { $project: { _id: false, expeditionCount: 1, station: { $arrayElemAt: ['$stations', 0] } } },
    { $sort: { expeditionCount: -1 } },
    { $limit: 5 }
  ]);

  stationMetrics.protocolStatusCounts = { incomplete: 0, submitted: 0, returned: 0, published: 0, unpublished: 0 };
  stationMetrics.stationCounts = { total: 0, lost: 0, active: 0 };
  stationMetrics.expeditionCounts = { total: 0, incomplete: 0, pending: 0, returned: 0, published: 0, unpublished: 0 };

  stationCountQuery.exec(function(err, stationCount) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting station count: ' + errorHandler.getErrorMessage(err)
      });
    } else {
      stationMetrics.stationCounts.total = stationCount;
      stationCountsByStatusQuery.exec(function(err, statusCounts) {
        if (err) {
          return res.status(400).send({
            message: 'Error getting station counts by status: ' + errorHandler.getErrorMessage(err)
          });
        } else {
          for(var i = 0; i < statusCounts.length; i++) {
            stationMetrics.stationCounts[statusCounts[i].status] = statusCounts[i].count;
          }
          expeditionCountQuery.exec(function(err, expeditionCount) {
            if(err) {
              return res.status(400).send({
                message: 'Error getting expedition total count: ' + errorHandler.getErrorMessage(err)
              });
            } else {
              stationMetrics.expeditionCounts.total = expeditionCount;
              expeditionCountByStatusQuery.exec(function(err, expeditionCountsByStatus) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting expedition count: ' +errorHandler.getErrorMessage(err)
                  });
                } else {
                  for(var i = 0; i < expeditionCountsByStatus.length; i++) {
                    stationMetrics.expeditionCounts[expeditionCountsByStatus[i].status] = expeditionCountsByStatus[i].count;
                  }
                  protocolMobileTrapStatusQuery.exec(function(err, protocolStatusCount) {
                    if (err) {
                      return res.status(400).send({
                        message: 'Error geting protocol mobile trap status: ' + errorHandler.getErrorMessage(err)
                      });
                    } else {
                      for(var i = 0; i < protocolStatusCount.length; i++) {
                        if(protocolStatusCount[i]._id !== null && protocolStatusCount[i]._id !== undefined) {
                          stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] =
                            stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                        }
                      }
                      protocolOysterMeasurementStatusQuery.exec(function(err, protocolStatusCount) {
                        if (err) {
                          return res.status(400).send({
                            message: 'Error getting protocol oyster measurement status: ' + errorHandler.getErrorMessage(err)
                          });
                        } else {

                          for(var i = 0; i < protocolStatusCount.length; i++) {
                            stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] =
                              stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                          }
                          protocolSettlementTileStatusQuery.exec(function(err, protocolStatusCount) {
                            if (err) {
                              return res.status(400).send({
                                message: 'Error getting protocol settlement tiles status: ' + errorHandler.getErrorMessage(err)
                              });
                            } else {

                              for(var i = 0; i < protocolStatusCount.length; i++) {
                                stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] =
                                  stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                              }
                              protocolSiteConditionStatusQuery.exec(function(err, protocolStatusCount) {
                                if (err) {
                                  return res.status(400).send({
                                    message: 'Error getting protocol site condition status: ' + errorHandler.getErrorMessage(err)
                                  });
                                } else {

                                  for(var i = 0; i < protocolStatusCount.length; i++) {
                                    stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] =
                                      stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                                  }
                                  protocolWaterQualityStatusQuery.exec(function(err, protocolStatusCount) {
                                    if (err) {
                                      return res.status(400).send({
                                        message: 'Error getting protocol water quality status: ' + errorHandler.getErrorMessage(err)
                                      });
                                    } else {

                                      for(var i = 0; i < protocolStatusCount.length; i++) {
                                        stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] =
                                          stationMetrics.protocolStatusCounts[protocolStatusCount[i]._id] + protocolStatusCount[i].count;
                                      }
                                      expeditionsCompleteQuery.exec(function(err, expeditionData) {
                                        if (err) {
                                          return res.status(400).send({
                                            message: 'Error getting expeditions complete: ' + errorHandler.getErrorMessage(err)
                                          });
                                        } else {
                                          stationMetrics.expeditionStatusCounts = {
                                            future: 0,
                                            completed: 0
                                          };
                                          for(var i = 0; i < expeditionData.length; i++) {
                                            if(expeditionData[i].future === false) {
                                              stationMetrics.expeditionStatusCounts.completed = expeditionData[i].count;
                                            } else if(expeditionData[i].future === true) {
                                              stationMetrics.expeditionStatusCounts.future = expeditionData[i].count;
                                            }
                                          }
                                          mostVisitedStationsQuery.exec(function(err, stationVisitCountData) {
                                            if (err) {
                                              return res.status(400).send({
                                                message: 'Error getting most visited stations: ' + errorHandler.getErrorMessage(err)
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
    }
  });
};

exports.getEventMetrics = function(req, res) {
  var eventMetrics = {};

  var futureEventsQuery = CalendarEvent.count({
    'dates.startDateTime': { '$gte': new Date() }
  });

  var pastEventsQuery = CalendarEvent.count({
    'dates.startDateTime': { '$lt': new Date() }
  });

  var eventTypesQuery = MetaEventType.find({});

  var eventsPerTypeQuery = CalendarEvent.aggregate([
    { $unwind: '$category.type' },
    { $group: { _id: '$category.type', eventTypeCount: { $sum: 1 } } },
    { $lookup: { from: 'metaeventtypes', localField: '_id', foreignField: '_id', as: 'eventtypes' } },
    { $match: { 'eventtypes.0': { $exists: true } } },
    { $project: { _id: 1, eventTypeCount: 1, eventType: { $arrayElemAt: ['$eventtypes', 0] } } }
  ]);

  var avgRegistrationRateQuery = CalendarEvent.aggregate([
    { $match: { 'dates.startDateTime': { '$lte': new Date() } } }, //only past events
    { $project: { _id: false, registrants: 1, maximumCapacity: 1, registrationCount: { $size: '$registrants' } } },
    { $match: { 'maximumCapacity': { '$gt': 0 } } },
    { $project: { registrationRate: { $divide: [ '$registrationCount', '$maximumCapacity'] } } },
    { $group: { _id: true, avgRegistrationRate: { $avg: '$registrationRate' } } }
  ]);

  var avgAttendanceRateQuery = CalendarEvent.aggregate([
    { $match: { 'dates.startDateTime': { '$lte': new Date() } } }, // only past events
    { $project: { _id: 1, registrants: 1, registrantCount: { $size: '$registrants' } } },
    { $match: { 'registrantCount': { '$gt': 0 } } },
    { $project: { _id: 1, registrants: 1, registrantCount: 1,
      registrantsAttended: {
        $filter: {
          input: '$registrants',
          as: 'registrant',
          cond: '$$registrant.attended'
        }
      }
    } },
    { $project: { _id: 1, registrants: 1, registrantCount: 1, attendedCount: { $size: '$registrantsAttended' } } },
   { $project: { _id: 1, attendanceRate: { $divide: [ '$attendedCount', '$registrantCount' ] } } },
   { $group: { _id: true, avgAttendanceRate: { $avg: '$attendanceRate' } } }
  ]);

  var yearsWithEventsQuery = CalendarEvent.aggregate([
    { $unwind: '$dates' },
    { $project: { _id: 1, startDateTime: '$dates.startDateTime' } },
    { $project: { _id: 1, year: { $year: '$startDateTime' } } },
    { $group: { _id: '$year' } },
    { $sort: { _id: -1 } }
  ]);

  var eventCounts = { future: 0, past: 0 };
  var eventTypeCounts = {};

  futureEventsQuery.exec(function(err, futureEventsCount) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting future events: ' + errorHandler.getErrorMessage(err)
      });
    } else {
      eventCounts.future = futureEventsCount;
      pastEventsQuery.exec(function(err, pastEventsCount) {
        if (err) {
          return res.status(400).send({
            message: 'Error getting past events: ' + errorHandler.getErrorMessage(err)
          });
        } else {
          eventCounts.past = pastEventsCount;
          eventMetrics.eventCounts = eventCounts;
          avgRegistrationRateQuery.exec(function(err, avgRegistrationData) {
            if (err) {
              return res.status(400).send({
                message: 'Error getting avg registration rate: ' + errorHandler.getErrorMessage(err)
              });
            } else {
              if(avgRegistrationData !== undefined && avgRegistrationData.length === 1) {
                eventMetrics.avgRegistrationRate = avgRegistrationData[0].avgRegistrationRate;
              } else {
                eventMetrics.avgRegistrationRate = 0;
              }
              avgAttendanceRateQuery.exec(function(err, avgAttendanceData) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting average attendance rate: ' + errorHandler.getErrorMessage(err)
                  });
                } else {
                  if(avgAttendanceData !== undefined && avgAttendanceData.length === 1) {
                    eventMetrics.avgAttendanceRate = avgAttendanceData[0].avgAttendanceRate;
                  } else {
                    eventMetrics.avgAttendanceRate = 0;
                  }
                  eventTypesQuery.exec(function(err, eventTypesData) {
                    if (err) {
                      return res.status(400).send({
                        message: 'Error getting event types: ' + errorHandler.getErrorMessage(err)
                      });
                    } else {
                      for(var i = 0; i < eventTypesData.length; i++) {
                        eventTypeCounts[eventTypesData[i].type] = 0;
                      }
                      eventsPerTypeQuery.exec(function(err, eventsPerTypeData) {
                        if (err) {
                          return res.status(400).send({
                            message: 'Error getting events per type: ' + errorHandler.getErrorMessage(err)
                          });
                        } else {
                          for(var i = 0; i < eventsPerTypeData.length; i++) {
                            eventTypeCounts[eventsPerTypeData[i].eventType.type] = eventsPerTypeData[i].eventTypeCount;
                          }
                          eventMetrics.eventTypeCounts = eventTypeCounts;
                          yearsWithEventsQuery.exec(function(err, yearData) {
                            if (err) {
                              return res.status(400).send({
                                message: 'Error getting years with events: ' + errorHandler.getErrorMessage(err)
                              });
                            } else {
                              var yearsWithEvents = [];
                              if(yearData !== undefined && yearData.length > 0) {
                                for(var i = 0; i < yearData.length; i++) {
                                  yearsWithEvents.push(yearData[i]._id);
                                }
                              }
                              eventMetrics.yearsWithEvents = yearsWithEvents;
                              res.json(eventMetrics);
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

exports.getEventActivity = function(req, res) {
  var activityMatch = null;
  var startDate, endDate;
  if(req.query.startDate) {
    startDate = moment(req.query.startDate).toDate();
  }
  if(req.query.endDate) {
    endDate = moment(req.query.endDate).toDate();
  }

  if(startDate !== null && startDate !== undefined &&
    endDate !== null && endDate !== undefined) {
    activityMatch = { $match: { $and: [
      { startDate: { $gte: new Date(startDate) } },
      { endDate: { $lt: new Date(endDate) } }
    ] } };
  } else if(startDate !== null && startDate !== undefined) {
    activityMatch = {
      $match: { startDate: { $gte: new Date(startDate) } }
    };
  } else if(endDate !== null && endDate !== undefined) {
    activityMatch = {
      $match: { startDate: { $lt: new Date(endDate) } }
    };
  }

  var sort = null;
  if(req.query.sort === 'registrants') {
    sort = { $sort: { 'registrantCount': -1 } };
  } else if(req.query.sort === 'attendees') {
    sort = { $sort: { 'attendedCount': -1 } };
  } else if(req.query.sort === 'capacityRate') {
    sort = { $sort: { 'registrationRate': -1 } };
  } else if(req.query.sort === 'attendanceRate') {
    sort = { $sort: { 'attendanceRate': -1 } };
  }

  var eventActivityQuery = CalendarEvent.aggregate([
    { $unwind: '$dates' },
    { $project: {
      _id: 1, title: 1, registrants: 1, registrantCount: { $size: '$registrants' }, deadlineToRegister: 1,
      maximumCapacity: 1, startDate: '$dates.startDateTime', endDate: '$dates.endDateTime'
    } },
    activityMatch,
    { $project: { _id: 1, title: 1, registrants: 1, registrantCount: 1, deadlineToRegister: 1,
      maximumCapacity: 1, startDate: 1, endDate: 1,
      registrantsAttended: {
        $filter: {
          input: '$registrants',
          as: 'registrant',
          cond: '$$registrant.attended'
        }
      }
    } },
    { $project: { _id: 1, title: 1, registrants: 1, registrantCount: 1, deadlineToRegister: 1, maximumCapacity: 1,
      startDate: 1, endDate: 1, registrantsAttended: 1, attendedCount: { $size: '$registrantsAttended' } } },
    { $project: { _id: 1, title: 1, registrants: 1, registrantCount: 1, deadlineToRegister: 1, maximumCapacity: 1,
      startDate: 1, endDate: 1, registrantsAttended: 1, attendedCount: 1,
      attendanceRate: {
        $cond: { if: { $gt: [ '$registrantCount', 0] }, then: { $divide: [ '$attendedCount', '$registrantCount' ] }, else: 0 }
      },
      registrationRate: {
        $cond: { if: { $gt: [ '$maximumCapacity', 0] }, then: { $divide: [ '$registrantCount', '$maximumCapacity' ] }, else: 0 }
      }
    } },
    sort,
    { $limit: 10 }
  ]);

  eventActivityQuery.exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: 'Error running event yearly statistics query;' + errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(data);
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
      start: moment(prevMonth).startOf('month').toDate(),
      end: moment(prevMonth).endOf('month').toDate()
    });
    prevMonth.add(1, 'months');
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
          message: 'Error getting monthly unit counts: ' + errorHandler.getErrorMessage(err)
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
          message: 'Error getting monthly lesson counts: ' + errorHandler.getErrorMessage(err)
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
          message: 'Error getting monthly station counts: ' + errorHandler.getErrorMessage(err)
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
          message: 'Error getting monthly expedition counts: ' + errorHandler.getErrorMessage(err)
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

exports.getMonthlyEventCounts = function(req, res) {
  var monthTimeIntervals = calculateMonthTimeIntervals(req.query.months ? req.query.months : 12);
  function queryByTimeInterval(metrics, timeIntervalArray, currIndex) {
    if(currIndex === timeIntervalArray.length) {
      res.json(metrics);
      return;
    }
    var eventCountsByTimeInterval = CalendarEvent.count({ $or: [
      { $and: [
        { 'dates.startDateTime': { $gte: timeIntervalArray[currIndex].start } },
        { 'dates.startDateTime': { $lte: timeIntervalArray[currIndex].end } }
      ] },
      { $and: [
        { 'dates.endDateTime': { $gte: timeIntervalArray[currIndex].start } },
        { 'dates.endDateTime': { $lte: timeIntervalArray[currIndex].end } }
      ] }
    ] });
    eventCountsByTimeInterval.exec(function(err, eventCount) {
      if (err) {
        return res.status(400).send({
          message: 'Error getting monthly event counts: ' + errorHandler.getErrorMessage(err)
        });
      } else {
        metrics.push(eventCount);
        queryByTimeInterval(metrics, timeIntervalArray, currIndex+1);
      }
    });
  }

  var metricsResults = [];
  queryByTimeInterval(metricsResults, monthTimeIntervals, 0);
};

//To delete the download folder with all csv data
var deleteNonemptyFolder = function(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + '/' + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteNonemptyFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

exports.downloadZip = function(req, res) {
  var archive = archiver('zip');
  var csvFilepath = path.resolve('./modules/metrics/server/downloads');

  try {
    fs.mkdirSync(csvFilepath, '0755');
  } catch(e) {
    if(e.code !== 'EEXIST') {
      return res.status(500).send({
        message: 'Error creating /downloads directory for archive ' + e.code
      });
    }
  }

  archive.on('error', function(err) {
    return res.status(500).send({
      message: 'Error creating archive: ' + err.message
    });
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('called archive onEnd with filepath ' + csvFilepath);
    if (csvFilepath && csvFilepath !== '') {
      fs.exists(csvFilepath, function(exists) {
        if (exists) {
          console.log('\tDeleting ' + csvFilepath);
          deleteNonemptyFolder(csvFilepath);
        //  fs.unlink(csvFilepath);
        }
      });
    }
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('metrics.zip');
  res.setHeader('Content-Type', 'application/zip, application/octet-stream');

  //this is the streaming magic
  archive.pipe(res);

  //TODO: change teamLead to teamLeads when new user profile
  //stuff is integrated
  var teamSizesQuery = Team.aggregate([
    { $project: { id: 1, name: 1, teamLead: 1, schoolOrg: 1,
      teamMemberCount: { $cond: { if: { teamMembers: { $gt: [ { $size: '$teamMembers' }, 0 ] } }, then: { $size: '$teamMembers' }, else: 0 } } }
    },
    { $sort: { teamMemberCount: -1 } },
    { $lookup: { from: 'schoolorgs', localField: 'schoolOrg', foreignField: '_id', as: 'schoolOrgs' } },
    { $match: { 'schoolOrgs.0': { $exists: true } } },
    { $project: { id: 1, name: 1, teamMemberCount: 1, schoolOrg: { $arrayElemAt: [ '$schoolOrgs', 0 ] } } }
  ]);

  var userLoginReportQuery = UserActivity.aggregate([
    { $group: { _id: { user: '$user', activity: '$activity' }, loginCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id.user', foreignField: '_id', as: 'users' } },
    { $match: { 'users.0': { $exists: true } } },
    { $project: { _id: false, user: { $arrayElemAt: ['$users', 0] }, loginCount: 1 } },
    { $sort: { loginCount: -1 } },
    { $lookup: { from: 'schoolorgs', localField: 'user.schoolOrg', foreignField: '_id', as: 'schoolOrgs' } },
    { $match: { 'schoolOrgs.0': { $exists: true } } },
    { $project: { _id: false, loginCount: 1, user: 1, schoolOrg: { $arrayElemAt: [ '$schoolOrgs', 0 ] } } }
  ]);

  var lessonActivityQuery = LessonActivity.aggregate([
    { $lookup: { from: 'lessons', localField: 'lesson', foreignField: '_id', as: 'lessons' } },
    { $match: { 'lessons.0': { $exists: true } } },
    { $project: { _id: '$_id', created: 1, activity: 1, lesson: { $arrayElemAt: ['$lessons', 0] } } },
    { $lookup: { from: 'units', localField: 'lesson.unit', foreignField: '_id', as: 'units' } },
    { $match: { 'units.0': { $exists: true } } },
    { $project: { _id: 1, created: 1, lesson: 1, activity: 1, unit: { $arrayElemAt: ['$units', 0] } } },
    { $sort: { created: -1 } }
  ]);

  var unitActivityQuery = UnitActivity.aggregate([
    { $lookup: { from: 'units', localField: 'unit', foreignField: '_id', as: 'units' } },
    { $match: { 'units.0': { $exists: true } } },
    { $project: { _id: '$_id', created: 1, activity: 1, unit: { $arrayElemAt: ['$units', 0] } } },
    { $sort: { created: -1 } }
  ]);

  var stationExpeditionsQuery = Expedition.aggregate([
    { $lookup: { from: 'restorationstations', localField: 'station', foreignField: '_id', as: 'stations' } },
    { $match: { 'stations.0': { $exists: true } } },
    { $lookup: { from: 'users', localField: 'teamLead', foreignField: '_id', as: 'teamLeads' } },
    { $match: { 'teamLeads.0': { $exists: true } } },
    { $lookup: { from: 'teams', localField: 'team', foreignField: '_id', as: 'teams' } },
    { $match: { 'teams.0': { $exists: true } } },
    { $project: { _id: 1, name: 1, monitoringStartDate: 1, monitoringEndDate: 1,
      teamLead: { $arrayElemAt: ['$teamLeads', 0] },
      team: { $arrayElemAt: ['$teams', 0] },
      station: { $arrayElemAt: ['$stations', 0] }
    } },
    { $sort: { monitoringStartDate: 1 } }
  ]);

  var eventsQuery = CalendarEvent.aggregate([
    { $unwind: '$dates' },
    { $project: {
      _id: 1, title: 1, description: 1, registrants: 1, registrantCount: { $size: '$registrants' }, deadlineToRegister: 1,
      maximumCapacity: 1, startDate: '$dates.startDateTime', endDate: '$dates.endDateTime', user: 1, eventType: '$category.type'
    } },
    { $project: { _id: 1, title: 1, description: 1, registrants: 1, registrantCount: 1, deadlineToRegister: 1,
      maximumCapacity: 1, startDate: 1, endDate: 1, user: 1, eventType: 1,
      registrantsAttended: {
        $filter: {
          input: '$registrants',
          as: 'registrant',
          cond: '$$registrant.attended'
        }
      }
    } },
    { $project: { _id: 1, title: 1, description: 1, registrantCount: 1, deadlineToRegister: 1, maximumCapacity: 1,
      startDate: 1, endDate: 1, attendedCount: { $size: '$registrantsAttended' } , user: 1, eventType: 1 }
    },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'users' } },
    { $lookup: { from: 'metaeventtypes', localField: 'eventType', foreignField: '_id', as: 'eventTypes' } },
    { $project: { _id: 1, title: 1, description: 1, registrantCount: 1, deadlineToRegister: 1, maximumCapacity: 1,
      startDate: 1, endDate: 1, attendedCount: 1,
      user: { $arrayElemAt: ['$users', 0] },
      type: { $arrayElemAt: ['$eventTypes', 0] }
    } },
    { $project: { _id: 1, title: 1, description: 1, registrantCount: 1, deadlineToRegister: 1, maximumCapacity: 1,
      startDate: 1, endDate: 1, attendedCount: 1,
      user: '$user.displayName',
      type: '$type.type'
    } }
  ]);

  teamSizesQuery.exec(function(err, teamSizeData) {
    if (!err) {
      var csvFields = [
        {
          label: 'Team Name',
          value: 'name',
          default: 'Unknown Team Name'
        }, {
          label: 'Member Count',
          value: 'teamMemberCount',
          default: '-1'
        }, {
          label: 'Organization',
          value: 'schoolOrg.name',
          default: 'Unknown Organization Name'
        }
      ];
      var teamSizeCsvData = json2csv({ data: teamSizeData, fields: csvFields });
      var teamSizeFile = path.join(csvFilepath, 'teams.csv');
      fs.writeFileSync(teamSizeFile, teamSizeCsvData);
      archive.file(teamSizeFile, { name: 'teams.csv' });
    }

    userLoginReportQuery.exec(function(err, userLoginData) {
      if(!err) {
        var csvFields = [
          {
            label: 'Username',
            value: 'user.username',
            default: 'Unknown Username'
          }, {
            label: 'User Display Name',
            value: 'user.displayName',
            default: ''
          }, {
            label: 'User Email',
            value: 'user.email',
            default: ''
          },{
            label: 'Number of Logins',
            value: 'loginCount',
            default: 'none'
          }
        ];
        var userLoginsCsvData = json2csv({ data: userLoginData, fields: csvFields });
        var userLoginsFile = path.join(csvFilepath, 'people-activity.csv');
        fs.writeFileSync(userLoginsFile, userLoginsCsvData);
        archive.file(userLoginsFile, { name: 'people-activity.csv' });
      }
      unitActivityQuery.exec(function(err, unitActivityData) {
        if(!err) {
          var csvFields = [
            {
              label: 'Unit',
              value: 'unit.title',
              default: 'Unknown Unit'
            }, {
              label: 'Activity',
              value: 'activity',
              default: 'Unknown Activity'
            },{
              label: 'Activity Date',
              value: function(row, field, data) {
                return moment(row.created).format('YYYY-MM-DD HH:mm');
              },
              default: ''
            }
          ];
          var unitActivityCsvData = json2csv({ data: unitActivityData, fields: csvFields });
          var unitActivityFile = path.join(csvFilepath, 'curriculum-unit-activity.csv');
          fs.writeFileSync(unitActivityFile, unitActivityCsvData);
          archive.file(unitActivityFile, { name: 'curriculum-unit-activity.csv' });
        }
        stationExpeditionsQuery.exec(function(err, stationExpeditionsData) {
          if(!err) {
            var csvFields = [
              {
                label: 'Station',
                value: 'station.name',
                default: 'Unknown Station'
              },{
                label: 'Expedition',
                value: 'name',
                default: ''
              },{
                label: 'Team',
                value: 'team.name',
                default: ''
              },{
                label: 'Team Lead',
                value: 'teamLead.displayName',
                default: ''
              },{
                label: 'Start Date',
                value: function(row, field, data) {
                  return moment(row.monitoringStartDate).format('YYYY-MM-DD HH:mm');
                },
                default: ''
              },{
                label: 'End Date',
                value: function(row, field, data) {
                  return moment(row.monitoringEndDate).format('YYYY-MM-DD HH:mm');
                },
                default: ''
              }
            ];
            var stationExpeditionsCsvData = json2csv({ data: stationExpeditionsData, fields: csvFields });
            var stationExpeditionsFile = path.join(csvFilepath, 'stations.csv');
            fs.writeFileSync(stationExpeditionsFile, stationExpeditionsCsvData);
            archive.file(stationExpeditionsFile, { name: 'stations.csv' });
            archive.finalize();
          }
        });
      });
    });
  });
};

exports.downloadEvents = function(req, res) {
  statsHandler.eventStats(function(eventData, eventFields) {
    json2csv({ data: eventData, fields: eventFields }, function(err, eventCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=events.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(eventCsvData);
    });
  });
};

exports.downloadTeamLeads = function(req, res) {
  statsHandler.teamLeadStats(function(teamLeadData, teamLeadFields) {
    json2csv({ data: teamLeadData, fields: teamLeadFields }, function(err, teamLeadCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=team-leads.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(teamLeadCsvData);
    });
  });
};

exports.downloadTeamMembers = function(req, res) {
  statsHandler.teamMemberStats(function(teamMemberData, teamMemberFields) {
    json2csv({ data: teamMemberData, fields: teamMemberFields }, function(err, teamMemberCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=team-members.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(teamMemberCsvData);
    });
  });
};

exports.downloadExpeditions = function(req, res) {
  statsHandler.expeditionStats(function(expeditionData, expeditionFields) {
    json2csv({ data: expeditionData, fields: expeditionFields }, function(err, expeditionCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=expeditions.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(expeditionCsvData);
    });
  });
};

exports.downloadLessons = function(req, res) {
  statsHandler.lessonStats(function(lessonData, lessonFields) {
    json2csv({ data: lessonData, fields: lessonFields }, function(err, lessonCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=lessons.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(lessonCsvData);
    });
  });
};

exports.downloadOrganizations = function(req, res) {
  statsHandler.organizationStats(function(orgData, orgFields) {
    json2csv({ data: orgData, fields: orgFields }, function(err, orgCsvData) {
      res.setHeader('Content-disposition', 'attachment; filename=organizations.csv');
      res.setHeader('content-type', 'text/csv');
      res.send(orgCsvData);
    });
  });
};
