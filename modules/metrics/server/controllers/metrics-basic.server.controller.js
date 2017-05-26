'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Team = mongoose.model('Team'),
  Org = mongoose.model('SchoolOrg'),
  Unit = mongoose.model('Unit'),
  Lesson = mongoose.model('Lesson'),
  LessonTracker = mongoose.model('LessonTracker'),
  RestorationStation = mongoose.model('RestorationStation'),
  Expedition = mongoose.model('Expedition'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  request = require('request'),
  moment = require('moment');

exports.getBasicMetrics = function(req, res) {
  var allUserCountQuery = User.count({});
  var allTeamsCountQuery = Team.count({});
  var teamLeadCountQuery = User.count({ 'roles': 'team lead' });
  var teamMemberCountQuery = User.count({ 'roles': 'team member' });
  var teachersCountQuery = User.count({ $and: [{ 'teamLeadType': { $exists: true } }, { teamLeadType: 'teacher' } ] });
  var allOrgsCountQuery = Org.count({});

  var allExpeditionsQuery = Expedition.count({});
  var publishedExpeditionsQuery = Expedition.count({ status: 'published' });
  var activeStationsQuery = RestorationStation.count({ $or: [ { status: 'active' }, { status: 'Active' } ] });

  var allUnitsCountQuery = Unit.count({});
  var allLessonCountQuery = Lesson.count({});
  var taughtStudentsCountQuery = LessonTracker.aggregate([{
    $group: { _id: 1, total: { $sum: '$totalNumberOfStudents' } }
  }]);

  var pastEventCountQuery = CalendarEvent.count({
    'dates.startDateTime': { '$lt': new Date() }
  });

  var futureEventCountQuery = CalendarEvent.count({
    'dates.startDateTime': { '$gte': new Date() }
  });

  var pastEventRegistrationCountQuery = CalendarEvent.aggregate([
    { $match: { 'dates.startDateTime': { '$lte': new Date() } } }, //only past events
    { $project: { _id: 1, registrants: 1, registrationCount: { $size: '$registrants' } } },
    { $group: { _id: 1, total: { $sum: '$registrationCount' } } }
  ]);

  var metrics = {};
  allUserCountQuery.exec(function(err, userCount) {
    if (err) {
      return res.status(400).send({
        message: 'Error getting user count:' + errorHandler.getErrorMessage(err)
      });
    } else {
      metrics.userCount = userCount;
      allTeamsCountQuery.exec(function(err, teamCount) {
        if (err) {
          return res.status(400).send({
            message: 'Error getting team count:' + errorHandler.getErrorMessage(err)
          });
        } else {
          metrics.teamCount = teamCount;
          teamLeadCountQuery.exec(function(err, teamLeadCount) {
            if (err) {
              return res.status(400).send({
                message: 'Error getting team lead count:' + errorHandler.getErrorMessage(err)
              });
            } else {
              metrics.teamLeadCount = teamLeadCount;
              teamMemberCountQuery.exec(function(err, teamMemberCount) {
                if (err) {
                  return res.status(400).send({
                    message: 'Error getting team member count:' + errorHandler.getErrorMessage(err)
                  });
                } else {
                  metrics.teamMemberCount = teamMemberCount;
                  teachersCountQuery.exec(function(err, teacherCount) {
                    if (err) {
                      return res.status(400).send({
                        message: 'Error getting teacher count:' + errorHandler.getErrorMessage(err)
                      });
                    } else {
                      metrics.teacherCount = teacherCount;
                      allOrgsCountQuery.exec(function(err, orgCount) {
                        if (err) {
                          return res.status(400).send({
                            message: 'Error getting org count:' + errorHandler.getErrorMessage(err)
                          });
                        } else {
                          metrics.orgCount = orgCount;
                          allExpeditionsQuery.exec(function(err, expeditionCount) {
                            if (err) {
                              return res.status(400).send({
                                message: 'Error getting expedition count:' + errorHandler.getErrorMessage(err)
                              });
                            } else {
                              metrics.expeditionCount = expeditionCount;
                              publishedExpeditionsQuery.exec(function(err, publishedExpeditionCount) {
                                if (err) {
                                  return res.status(400).send({
                                    message: 'Error getting published expedition count:' + errorHandler.getErrorMessage(err)
                                  });
                                } else {
                                  metrics.publishedExpeditionCount = publishedExpeditionCount;
                                  activeStationsQuery.exec(function(err, activeStationCount) {
                                    if (err) {
                                      return res.status(400).send({
                                        message: 'Error getting active station count:' + errorHandler.getErrorMessage(err)
                                      });
                                    } else {
                                      metrics.activeStationCount = activeStationCount;
                                      allUnitsCountQuery.exec(function(err, unitCount) {
                                        if (err) {
                                          return res.status(400).send({
                                            message: 'Error getting unit count:' + errorHandler.getErrorMessage(err)
                                          });
                                        } else {
                                          metrics.unitCount = unitCount;
                                          allLessonCountQuery.exec(function(err, lessonCount) {
                                            if (err) {
                                              return res.status(400).send({
                                                message: 'Error getting lesson count:' + errorHandler.getErrorMessage(err)
                                              });
                                            } else {
                                              metrics.lessonCount = lessonCount;
                                              taughtStudentsCountQuery.exec(function(err, taughtStudentCount) {
                                                if (err) {
                                                  return res.status(400).send({
                                                    message: 'Error getting taught student count:' + errorHandler.getErrorMessage(err)
                                                  });
                                                } else {
                                                  if(taughtStudentCount !== undefined && taughtStudentCount !== null &&
                                                    taughtStudentCount.length > 0) {
                                                    metrics.taughtStudentCount = taughtStudentCount[0].total;
                                                  }
                                                  pastEventCountQuery.exec(function(err, pastEventCount) {
                                                    if (err) {
                                                      return res.status(400).send({
                                                        message: 'Error getting past event count:' + errorHandler.getErrorMessage(err)
                                                      });
                                                    } else {
                                                      metrics.pastEventCount = pastEventCount;
                                                      pastEventRegistrationCountQuery.exec(function(err, registrantTotals) {
                                                        if (err) {
                                                          return res.status(400).send({
                                                            message: 'Error getting past registrant count:' + errorHandler.getErrorMessage(err)
                                                          });
                                                        } else {
                                                          if(registrantTotals !== undefined && registrantTotals !== null &&
                                                            registrantTotals.length > 0) {
                                                            metrics.eventRegistrantTotal = registrantTotals[0].total;
                                                          }
                                                          futureEventCountQuery.exec(function(err, futureEventCount) {
                                                            if (err) {
                                                              return res.status(400).send({
                                                                message: 'Error getting future event count:' + errorHandler.getErrorMessage(err)
                                                              });
                                                            } else {
                                                              metrics.currentEventCount = futureEventCount;
                                                              res.json(metrics);
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
        }
      });
    }
  });
};
