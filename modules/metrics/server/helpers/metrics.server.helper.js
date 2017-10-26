'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  moment = require('moment'),
  _ = require('lodash'),
  User = mongoose.model('User'),
  UserActivity = mongoose.model('UserActivity'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Expedition = mongoose.model('Expedition'),
  Lesson = mongoose.model('Lesson'),
  LessonActivity = mongoose.model('LessonActivity'),
  LessonFeedback = mongoose.model('LessonFeedback'),
  LessonTracker = mongoose.model('LessonTracker'),
  Team = mongoose.model('Team'),
  Research = mongoose.model('Research'),
  ResearchFeedback = mongoose.model('ResearchFeedback'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality');

exports.teamLeadStats = function(callback) {
  // Team lead,	Email,	Team Lead Type,	Org,	Org Type,	date account created,	log-ins,
  // Expeditions created,	Expeditions published,	Lessons viewed,	 Lessons logged,	Lessons reviewed,
  // Lessons created (forked or new),	teams,	total team members,	total research posters published by team members,
  // research posters published by self,	events registered,	events attended
  var csvFields = [
    {
      label: 'Team lead',
      value: 'name'
    }, {
      label: 'Email',
      value: 'email'
    }, {
      label: 'Team Lead Type',
      value: 'teamLeadType'
    }, {
      label: 'Org',
      value: 'schoolOrg'
    }, {
      label: 'Org Type',
      value: 'organizationType'
    }, {
      label: 'date account created',
      value: 'created'
    }, {
      label: 'log-ins',
      value: 'loginCount'
    }, {
      label: 'Expeditions created count',
      value: 'expeditionsCreatedCount'
    }, {
      label: 'Expeditions created',
      value: 'expeditionsCreated'
    }, {
      label: 'Expeditions published count',
      value: 'expeditionsPublishedCount'
    }, {
      label: 'Expeditions published',
      value: 'expeditionsPublished'
    }, {
      label: 'Lessons viewed count',
      value: 'lessonsViewedCount'
    }, {
      label: 'Lessons viewed',
      value: 'lessonsViewed'
    }, {
      label: 'Lessons logged count',
      value: 'lessonsLoggedCount'
    }, {
      label: 'Lessons logged',
      value: 'lessonsLogged'
    }, {
      label: 'Lessons reviewed count',
      value: 'lessonsFeedbackCount'
    }, {
      label: 'Lessons reviewed',
      value: 'lessonsFeedback'
    }, {
      label: 'Lessons created (forked or new) count',
      value: 'lessonsCreatedCount'
    }, {
      label: 'Lessons created (forked or new)',
      value: 'lessonsCreated'
    }, {
      label: 'teams count',
      value: 'teamCount'
    }, {
      label: 'teams',
      value: 'teams'
    }, {
      label: 'total team members',
      value: 'totalTeamMemberCount'
    }, {
      label: 'team members',
      value: 'teamMembers'
    }, {
      label: 'total research posters published by team members',
      value: 'totalPostersByTeamMembers'
    }, {
      label: 'research posters published by team members',
      value: 'postersByTeamMembers'
    }, {
      label: 'research posters published by self count',
      value: 'totalPostersBySelf'
    }, {
      label: 'research posters published by self',
      value: 'postersBySelf'
    }, {
      label: 'Events registered count',
      value: 'eventsRegisteredCount'
    }, {
      label: 'Events registered',
      value: 'eventsRegistered'
    }, {
      label: 'Events attended count',
      value: 'eventsAttendedCount'
    }, {
      label: 'Events attended',
      value: 'eventsAttended'
    }
  ];

  var rows = [];
  User.find({ 'roles': 'team lead' }).select('displayName email teamLeadType schoolOrg created')
  .populate('schoolOrg', 'name organizationType').exec(function(err, users) {
    async.forEach(users, function(user, eachCallback) {
      var userValues = {
        name: (user.displayName) ? user.displayName : '',
        email: (user.email) ? user.email : '',
        teamLeadType: (user.teamLeadType) ? user.teamLeadType : '',
        created: moment(user.created).format('YYYY-MM-DD HH:mm')
      };
      if (user.schoolOrg) {
        userValues.schoolOrg = (user.schoolOrg.name) ? user.schoolOrg.name : '';
        userValues.organizationType = (user.schoolOrg.organizationType) ? user.schoolOrg.organizationType : '';
      }
      UserActivity.count({ 'user': user._id, 'activity': 'login' }).exec(function(err, loginCount) {
        userValues.loginCount = (loginCount) ? loginCount : 0;
        Expedition.find({ 'teamLead': user._id }).select('name').exec(function(err, createdExpeditions) {
          if (createdExpeditions) {
            userValues.expeditionsCreatedCount = createdExpeditions.length;
            userValues.expeditionsCreated = _.join(_.map(createdExpeditions, 'name'), ', ');
          } else {
            userValues.expeditionsCreatedCount = 0;
            userValues.expeditionsCreated = '';
          }
          Expedition.find({ 'teamLead': user._id, 'status': 'published' }).select('name').exec(function(err2, publishedExpeditions) {
            if (publishedExpeditions) {
              userValues.expeditionsPublishedCount = publishedExpeditions.length;
              userValues.expeditionsPublished = _.join(_.map(publishedExpeditions, 'name'), ', ');
            } else {
              userValues.expeditionsPublishedCount = 0;
              userValues.expeditionsPublished = '';
            }
            Lesson.find({ 'user': user._id }).select('title').exec(function(err3, lessonsCreated) {
              if (lessonsCreated) {
                userValues.lessonsCreatedCount = lessonsCreated.length;
                userValues.lessonsCreated = _.join(_.map(lessonsCreated, 'title'), ', ');
              } else {
                userValues.lessonsCreatedCount = 0;
                userValues.lessonsCreated = '';
              }
              LessonActivity.find({ 'user': user._id, 'activity': 'viewed' }).select('lesson').populate('lesson', 'title')
              .exec(function(err4, lessonsViewed) {
                if (lessonsViewed) {
                  userValues.lessonsViewedCount = lessonsViewed.length;
                  userValues.lessonsViewed = _.join(_.map(lessonsViewed, 'lesson.title'), ', ');
                } else {
                  userValues.lessonsViewedCount = 0;
                  userValues.lessonsViewed = '';
                }
                LessonActivity.find({ 'user': user._id, 'activity': 'taught' }).select('lesson').populate('lesson', 'title')
                .exec(function(err5, lessonsLogged) {
                  if (lessonsLogged) {
                    userValues.lessonsLoggedCount = lessonsLogged.length;
                    userValues.lessonsLogged = _.join(_.map(lessonsLogged, 'lesson.title'), ', ');
                  } else {
                    userValues.lessonsLoggedCount = 0;
                    userValues.lessonsLogged = '';
                  }
                  LessonFeedback.find({ 'user': user._id }).select('lesson').populate('lesson', 'title')
                  .exec(function(err6, lessonsReviewed) {
                    if (lessonsReviewed) {
                      userValues.lessonsFeedbackCount = lessonsReviewed.length;
                      userValues.lessonsFeedback = _.join(_.map(lessonsReviewed, 'lesson.title'), ', ');
                    } else {
                      userValues.lessonsFeedbackCount = 0;
                      userValues.lessonsFeedback = '';
                    }
                    Team.find({ 'teamLeads': user._id }).select('name teamMembers').populate('teamMembers', 'displayName')
                    .exec(function(err7, teams) {
                      var teamMembers = [];
                      var teamMemberIds = [];
                      var teamMemberNames = [];
                      if (teams && teams.length > 0) {
                        userValues.teamCount = teams.length;
                        userValues.teams = _.join(_.map(teams, 'name'), ', ');
                        for(var i = 0; i < teams.length; i++) {
                          teamMembers = teamMembers.concat(teams[i].teamMembers);
                        }
                        teamMembers = _.uniqBy(teamMembers, '_id');
                        teamMemberIds = _.map(teamMembers, '_id');
                        teamMemberNames = _.map(teamMembers, 'displayName');
                        userValues.totalTeamMemberCount = teamMembers.length;
                        userValues.teamMembers = _.join(teamMemberNames, ', ');
                      } else {
                        userValues.teamCount = 0;
                        userValues.teams = '';
                        userValues.totalTeamMemberCount = 0;
                        userValues.teamMembers = '';
                      }
                      Research.find({ 'user': { $in: teamMemberIds } }).select('title').exec(function(err8, teamPosters) {
                        if (teamPosters) {
                          userValues.totalPostersByTeamMembers = teamPosters.length;
                          userValues.postersByTeamMembers = _.join(_.map(teamPosters, 'title'), ', ');
                        } else {
                          userValues.totalPostersByTeamMembers = 0;
                          userValues.postersByTeamMembers = '';
                        }
                        Research.find({ 'user': user._id }).select('title').exec(function(err9, selfPosters) {
                          if (selfPosters) {
                            userValues.totalPostersBySelf = selfPosters.length;
                            userValues.postersBySelf = _.join(_.map(selfPosters, 'title'), ', ');
                          } else {
                            userValues.totalPostersBySelf = 0;
                            userValues.postersBySelf = '';
                          }
                          CalendarEvent.find({ 'registrants.user': user._id }).select('title')
                          .exec(function(err10, registeredEvents) {
                            if (registeredEvents) {
                              userValues.eventsRegisteredCount = registeredEvents.length;
                              userValues.eventsRegistered = _.join(_.map(registeredEvents, 'title'), ', ');
                            } else {
                              userValues.eventsRegisteredCount = 0;
                              userValues.eventsRegistered = '';
                            }
                            CalendarEvent.find({
                              'registrants': {
                                '$elemMatch': {
                                  'user': user._id,
                                  'attended': true
                                }
                              }
                            }).select('title').exec(function(err11, attendedEvents) {
                              if (attendedEvents) {
                                userValues.eventsAttendedCount = attendedEvents.length;
                                userValues.eventsAttended = _.join(_.map(attendedEvents, 'title'), ', ');
                              } else {
                                userValues.eventsAttendedCount = 0;
                                userValues.eventsAttended = '';
                              }
                              rows.push(userValues);
                              eachCallback();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.teamMemberStats = function(callback) {
  //Team member, email, team, org, expeditions invited,	protocols submitted, protocols published,
  //research published, research reviewed
  var csvFields = [
    {
      label: 'Team member',
      value: 'name'
    }, {
      label: 'Email',
      value: 'email'
    }, {
      label: 'Team count',
      value: 'teamsCount'
    }, {
      label: 'Teams',
      value: 'teams'
    }, {
      label: 'Org count',
      value: 'schoolOrgsCount'
    }, {
      label: 'Orgs',
      value: 'schoolOrgs'
    }, {
      label: 'date account created',
      value: 'created'
    }, {
      label: 'log-ins',
      value: 'loginCount'
    }, {
      label: 'expeditions invited count',
      value: 'expeditionsInvitedCount'
    }, {
      label: 'expeditions invited',
      value: 'expeditionsInvited'
    }, {
      label: 'research published count',
      value: 'researchPublishedCount'
    }, {
      label: 'research published',
      value: 'researchPublished'
    }, {
      label: 'research reviewed count',
      value: 'researchFeedbackCount'
    }, {
      label: 'research reviewed',
      value: 'researchFeedback'
    }
  ];

  var rows = [];
  User.find({ 'roles': 'team member' }).select('displayName email schoolOrg created')
  .populate('schoolOrg', 'name').exec(function(err, users) {
    async.forEach(users, function(user, eachCallback) {
      var userValues = {
        name: (user.displayName) ? user.displayName : '',
        email: (user.email) ? user.email : '',
        created: moment(user.created).format('YYYY-MM-DD HH:mm')
      };
      var orgs = [];
      if (user.schoolOrg && user.schoolOrg.name) {
        orgs = [user.schoolOrg.name];
      }
      UserActivity.count({ 'user': user._id, 'activity': 'login' }).exec(function(err1, loginCount) {
        userValues.loginCount = (loginCount) ? loginCount : 0;
        Team.find({ 'teamMembers': user._id }).select('name schoolOrg').populate('schoolOrg', 'name').exec(function(err2, teams) {
          if (teams) {
            userValues.teams = _.join(_.map(teams, 'name'), ', ');
            userValues.teamsCount = teams.length;
            orgs = _.uniq(orgs.concat(_.map(teams, 'schoolOrg.name')));
            userValues.schoolOrgs = _.join(orgs, ', ');
            userValues.schoolOrgsCount = orgs.length;
          } else {
            userValues.teams = '';
            userValues.teamsCount = 0;
            userValues.schoolOrgs = '';
            userValues.schoolOrgsCount = 0;
          }
          Expedition.find({ $or: [{ 'teamLists.siteCondition': user._id },{ 'teamLists.oysterMeasurement': user._id },
          { 'teamLists.mobileTrap': user._id },{ 'teamLists.settlementTiles': user._id },
          { 'teamLists.waterQuality': user._id }] }).select('name').exec(function(err3, invitedExpeditions) {
            if (invitedExpeditions) {
              userValues.expeditionsInvitedCount = invitedExpeditions.length;
              userValues.expeditionsInvited = _.join(_.map(invitedExpeditions, 'name'), ', ');
            } else {
              userValues.expeditionsInvitedCount = 0;
              userValues.expeditionsInvited = '';
            }
            Research.find({ user: user._id, status: 'published' }).select('title')
            .exec(function(err11, researchCreated) {
              if (researchCreated) {
                userValues.researchPublished = _.join(_.map(researchCreated, 'title'), ', ');
                userValues.researchPublishedCount = researchCreated.length;
              } else {
                userValues.researchPublished = '';
                userValues.researchPublishedCount = 0;
              }
              ResearchFeedback.find({ user: user._id }).select('research')
              .populate('research', 'title').exec(function(err12, researchReviewed) {
                if (researchReviewed) {
                  userValues.researchFeedback = _.join(_.map(researchReviewed, 'research.title'), ', ');
                  userValues.researchFeedbackCount = researchReviewed.length;
                } else {
                  userValues.researchFeedback = '';
                  userValues.researchFeedbackCount = 0;
                }
                rows.push(userValues);
                eachCallback();
              });
            });
          });
        });
      });
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.organizationStats = function(callback) {
  // Org, Address, City, State, org type, Expeditions created, Expeditions published,
  // Lessons viewed, Lessons logged, Lessons reviewed, Lessons created (forked or new), teams,
  // total team members, total research posters published by all team members,
  // research posters published by team leads, events registered, events attended
  var csvFields = [
    {
      label: 'Organization',
      value: 'name'
    }, {
      label: 'Street',
      value: 'streetAddress'
    }, {
      label: 'City',
      value: 'city'
    }, {
      label: 'State',
      value: 'state'
    }, {
      label: 'Teams',
      value: 'teamCount'
    }, {
      label: 'Total team leads',
      value: 'totalTeamLeadCount'
    }, {
      label: 'Total team members',
      value: 'totalTeamMemberCount'
    }, {
      label: 'Expeditions created',
      value: 'expCreated'
    }, {
      label: 'Expeditions published',
      value: 'expPublished'
    }, {
      label: 'Lessons viewed',
      value: 'lessonsViewed'
    }, {
      label: 'Lessons logged',
      value: 'lessonsLogged'
    }, {
      label: 'Lessons reviewed',
      value: 'lessonsReviewed'
    }, {
      label: 'Lessons created (forked or new)',
      value: 'lessonsCreated'
    }, {
      label: 'Total research posters published by all team members',
      value: 'researchTeamMembers'
    }, {
      label: 'Total research posters published by all team leads',
      value: 'researchTotalLeads'
    }, {
      label: 'Events registered',
      value: 'eventsRegistered'
    }, {
      label: 'Events attended',
      value: 'eventsAttended'
    }
  ];

  var rows = [];
  SchoolOrg.find().select('name streetAddress city state').exec(function(err, orgs) {
    async.forEach(orgs, function(org, eachCallback) {
      var orgValues = {
        name: (org.name) ? org.name : '',
        streetAddress: (org.streetAddress) ? org.streetAddress : '',
        city: (org.city) ? org.city : '',
        state: (org.state) ? org.state: ''
      };
      Team.find({ schoolOrg: org._id }).select('name').exec(function(err1, teams) {
        orgValues.teamCount = (teams) ? teams.length : 0;
        Team.distinct('teamLeads', { schoolOrg: org._id }).exec(function(err2, teamTeamLeads) {
          User.distinct('_id', { roles: 'team lead', schoolOrg: org._id }).exec(function(err3, userTeamLeads) {
            var teamLeads = _.uniq(_.concat(teamTeamLeads, userTeamLeads));
            orgValues.totalTeamLeadCount = (teamLeads) ? teamLeads.length : 0;
            Team.distinct('teamMembers', { schoolOrg: org._id }).exec(function(err4, teamTeamMembers) {
              User.distinct('_id', { roles: 'team members', schoolOrg: org._id }).exec(function(err5, userTeamMembers) {
                var teamMembers = _.uniq(_.concat(teamTeamMembers, userTeamMembers));
                orgValues.totalTeamMemberCount = (teamMembers) ? teamMembers.length : 0;
                Expedition.aggregate([
                  { $match: { teamLead: { $in: teamLeads } } },
                  { $group: { _id: null,
                    created: { $sum: 1 },
                    published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                  } }
                ]).exec(function(err6, expResults) {
                  if (!expResults || expResults.length === 0) {
                    expResults = [{ _id: null, created: 0, published: 0 }];
                  }
                  orgValues.expCreated = expResults[0].created;
                  orgValues.expPublished = expResults[0].published;
                  Lesson.count({ user: { $in: teamLeads } }).exec(function(err7, lessonCount) {
                    orgValues.lessonsCreated = (lessonCount) ? lessonCount : 0;
                    LessonActivity.aggregate([
                      { $match: { user: { $in: teamLeads } } },
                      { $group: { _id: null,
                        viewed: { $sum: { $cond: [{ $eq: ['$activity', 'viewed'] }, 1, 0] } },
                        taught: { $sum: { $cond: [{ $eq: ['$activity', 'taught'] }, 1, 0] } },
                        reviewed: { $sum: { $cond: [{ $eq: ['$activity', 'feedback'] }, 1, 0] } },
                      } }
                    ]).exec(function(err8, lessonResults) {
                      if (!lessonResults || lessonResults.length === 0) {
                        lessonResults = [{ _id: null, viewed: 0, taught: 0, reviewed: 0 }];
                      }
                      orgValues.lessonsViewed = lessonResults[0].viewed;
                      orgValues.lessonsLogged = lessonResults[0].taught;
                      orgValues.lessonsReviewed = lessonResults[0].reviewed;
                      Research.count({ user: { $in: teamMembers } }).exec(function(err9, researchTeamMemberCount) {
                        orgValues.researchTeamMembers = (researchTeamMemberCount) ? researchTeamMemberCount : 0;
                        Research.count({ user: { $in: teamLeads } }).exec(function(err10, researchTotalLeadCount) {
                          orgValues.researchTotalLeads = (researchTotalLeadCount) ? researchTotalLeadCount: 0;
                          CalendarEvent.count({ 'registrants.user': { $in: teamLeads } })
                          .exec(function(err11, eventRegCount) {
                            orgValues.eventsRegistered = (eventRegCount) ? eventRegCount : 0;
                            CalendarEvent.count({ 'registrants': {
                              '$elemMatch': {
                                'user': { $in: teamLeads },
                                'attended': true
                              }
                            } }).exec(function(err12, eventAttCount) {
                              orgValues.eventsAttended = (eventAttCount) ? eventAttCount : 0;
                              rows.push(orgValues);
                              eachCallback();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.eventStats = function(callback) {
  // Events, start date, location,	capacity,	registered,	attended, --page views,	--waitlisted,	--unregistered
  var csvFields = [
    {
      label: 'Events',
      value: 'title'
    }, {
      label: 'Start Date',
      value: 'startDate'
    }, {
      label: 'Location',
      value: 'addressString'
    }, {
      label: 'Capacity',
      value: 'maximumCapacity'
    }, {
      label: 'Registered Count',
      value: 'registeredCount'
    }, {
      label: 'Registered',
      value: 'registered'
    }, {
      label: 'Attended Count',
      value: 'attendedCount'
    }, {
      label: 'Attended',
      value: 'attended'
    }
  ];

  var rows = [];
  CalendarEvent.find().select('title dates location maximumCapacity registrants').populate('registrants.user', 'displayName')
  .exec(function(err, events) {
    async.forEach(events, function(event, eachCallback) {
      var eventValues = {
        title: (event.title) ? event.title : '',
        startDate: (event.dates && event.dates.length > 0 && event.dates[0].startDateTime) ?
          moment(event.dates[0].startDateTime).format('YYYY-MM-DD HH:mm') : '',
        addressString: (event.location && event.location.addressString) ? event.location.addressString : '',
        maximumCapacity: (event.maximumCapacity) ? event.maximumCapacity : ''
      };
      var registered = [];
      var attended = [];
      _.forEach(event.registrants, function(registrant) {
        if (registrant && registrant.user) {
          registered.push(registrant.user.displayName);
          if (registrant.attended) attended.push(registrant.user.displayName);
        }
      });
      eventValues.registeredCount = registered.length;
      eventValues.registered = _.join(registered, ', ');
      eventValues.attendedCount = attended.length;
      eventValues.attended = _.join(attended, ', ');
      rows.push(eventValues);
      eachCallback();
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.lessonStats = function(callback) {
  // Lesson,	units,	views,	downloads,	reviews,	rating - overall,	rating - standards,
  // rating - inquiry, rating - restoration,	total classes taught,	total students taught
  var csvFields = [
    {
      label: 'Lesson',
      value: 'title'
    }, {
      label: 'Units',
      value: 'units'
    }, {
      label: 'Views',
      value: 'views'
    }, {
      label: 'Downloads',
      value: 'downloads'
    }, {
      label: 'Reviews',
      value: 'reviews'
    }, {
      label: 'Rating - Overall',
      value: 'ratingOverall'
    }, {
      label: 'Rating - Effectiveness',
      value: 'ratingEffectiveness'
    }, {
      label: 'Rating - Inquiry',
      value: 'ratingInquiry'
    }, {
      label: 'Rating - Align',
      value: 'ratingAlign'
    }, {
      label: 'Rating - Restoration',
      value: 'ratingRestoration'
    }, {
      label: 'Total Classes Taught',
      value: 'totalClassesTaught'
    }, {
      label: 'Total Students Taught',
      value: 'totalStudentsTaught'
    }
  ];

  var rows = [];
  Lesson.find().select('title units').populate('units', 'title').exec(function(err, lessons) {
    async.forEach(lessons, function(lesson, eachCallback) {
      var lessonValues = {
        title: (lesson.title) ? lesson.title : '',
        units: (lesson.units) ? _.join(_.map(lesson.units, 'title'), ', ') : ''
      };
      LessonActivity.aggregate([
        { $match: { lesson: lesson._id } },
        { $group: { _id: null,
          views: { $sum: { $cond: [{ $eq: ['$activity', 'viewed'] }, 1, 0] } },
          downloads: { $sum: { $cond: [{ $eq: ['$activity', 'downloaded'] }, 1, 0] } }
        } }
      ]).exec(function(err2, activityResults) {
        if (!activityResults || activityResults.length === 0) {
          activityResults = [{ views: 0, downloads: 0 }];
        }
        lessonValues.views = activityResults[0].views;
        lessonValues.downloads = activityResults[0].downloads;
        LessonFeedback.aggregate([
          { $match: { lesson: lesson._id } },
          { $group: { _id: null,
            reviews: { $sum: 1 },
            ratingEffectiveness: { $avg: '$lessonEffective' },
            ratingInquiry: { $avg: '$lessonSupportScientificPractice' },
            ratingAlign: { $avg: '$lessonAlignWithCurriculumn' },
            ratingRestoration: { $avg: '$lessonPreparesStudents' }
          } }
        ]).exec(function(err3, feedbackResults) {
          if (!feedbackResults || feedbackResults.length === 0) {
            feedbackResults = [{ reviews: 0, ratingEffectiveness: 0, ratingInquiry: 0, ratingAlign: 0, ratingRestoration: 0 }];
          }
          var totalAvgs = (feedbackResults[0].ratingEffectiveness + feedbackResults[0].ratingInquiry +
            feedbackResults[0].ratingAlign + feedbackResults[0].ratingRestoration);
          var ratingOverall = (totalAvgs > 0) ? (totalAvgs/4) : 0;
          lessonValues.reviews = feedbackResults[0].reviews;
          lessonValues.ratingEffectiveness = _.round(feedbackResults[0].ratingEffectiveness, 2);
          lessonValues.ratingInquiry = _.round(feedbackResults[0].ratingInquiry, 2);
          lessonValues.ratingAlign = _.round(feedbackResults[0].ratingAlign, 2);
          lessonValues.ratingRestoration = _.round(feedbackResults[0].ratingRestoration, 2);
          lessonValues.ratingOverall = _.round(ratingOverall, 2);
          LessonTracker.aggregate([
            { $match: { lesson: lesson._id } },
            { $group: { _id: null,
              totalStudentsTaught: { $sum: '$totalNumberOfStudents' },
              totalClassesTaught: { $sum: '$totalNumberOfClassesOrSections' }
            } }
          ]).exec(function(err4, trackerResults) {
            if (!trackerResults || trackerResults.length === 0) {
              trackerResults = [{ totalStudentsTaught: 0, totalClassesTaught: 0 }];
            }
            lessonValues.totalStudentsTaught = trackerResults[0].totalStudentsTaught;
            lessonValues.totalClassesTaught = trackerResults[0].totalClassesTaught;
            rows.push(lessonValues);
            eachCallback();
          });
        });
      });
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.expeditionStats = function(callback) {
  // Expeditions, date, station, notes, team lead(s), team members
  var csvFields = [
    {
      label: 'Expedition',
      value: 'name'
    }, {
      label: 'Start Date',
      value: 'monitoringStartDate'
    }, {
      label: 'End Date',
      value: 'monitoringEndDate'
    }, {
      label: 'Station',
      value: 'stationName'
    }, {
      label: 'Status',
      value: 'status'
    }, {
      label: 'Notes',
      value: 'notes'
    }, {
      label: 'Team Lead',
      value: 'teamLead'
    }, {
      label: 'Team Member Count',
      value: 'teamMemberCount'
    }, {
      label: 'Team Members',
      value: 'teamMembers'
    }, {
      label: 'Site Condition Members',
      value: 'siteConditionMembers'
    }, {
      label: 'Oyster Measurement Members',
      value: 'oysterMeasurementMembers'
    }, {
      label: 'Mobile Trap Members',
      value: 'mobileTrapMembers'
    }, {
      label: 'Settlement Tiles Members',
      value: 'settlementTilesMembers'
    }, {
      label: 'Water Quality Members',
      value: 'waterQualityMembers'
    }
  ];

  var rows = [];
  Expedition.find().select('name monitoringStartDate monitoringEndDate station status notes teamLead teamLists')
  .populate('station', 'name').populate('teamLead', 'displayName').populate('teamLists.siteCondition', 'displayName')
  .populate('teamLists.oysterMeasurement', 'displayName').populate('teamLists.mobileTrap', 'displayName')
  .populate('teamLists.settlementTiles', 'displayName').populate('teamLists.waterQuality', 'displayName')
  .sort('-monitoringStartDate').exec(function(err, expeditions) {
    async.forEach(expeditions, function(expedition, eachCallback) {
      var expValues = {
        name: (expedition.name) ? expedition.name : '',
        monitoringStartDate: (expedition.monitoringStartDate) ?
          moment(expedition.monitoringStartDate).format('YYYY-MM-DD HH:mm') : '',
        monitoringEndDate: (expedition.monitoringEndDate) ?
          moment(expedition.monitoringEndDate).format('YYYY-MM-DD HH:mm') : '',
        stationName: (expedition.station && expedition.station.name) ? expedition.station.name : '',
        status: (expedition.status) ? expedition.status : '',
        notes: (expedition.notes) ? expedition.notes : '',
        teamLead: (expedition.teamLead && expedition.teamLead.displayName) ?
          expedition.teamLead.displayName : ''
      };
      var siteConditionMembers = (expedition.teamLists.siteCondition) ?
        _.map(expedition.teamLists.siteCondition, 'displayName') : [];
      var oysterMeasurementMembers = (expedition.teamLists.oysterMeasurement) ?
        _.map(expedition.teamLists.oysterMeasurement, 'displayName') : [];
      var mobileTrapMembers = (expedition.teamLists.mobileTrap) ?
        _.map(expedition.teamLists.mobileTrap, 'displayName') : [];
      var settlementTilesMembers = (expedition.teamLists.settlementTiles) ?
        _.map(expedition.teamLists.settlementTiles, 'displayName') : [];
      var waterQualityMembers = (expedition.teamLists.waterQuality) ?
        _.map(expedition.teamLists.waterQuality, 'displayName') : [];
      var teamMembers = _.uniq(_.concat(siteConditionMembers, oysterMeasurementMembers,
        mobileTrapMembers, settlementTilesMembers, waterQualityMembers));

      expValues.siteConditionMembers = _.join(siteConditionMembers, ', ');
      expValues.oysterMeasurementMembers = _.join(oysterMeasurementMembers, ', ');
      expValues.mobileTrapMembers = _.join(mobileTrapMembers, ', ');
      expValues.settlementTilesMembers = _.join(settlementTilesMembers, ', ');
      expValues.waterQualityMembers = _.join(waterQualityMembers, ', ');

      expValues.teamMemberCount = teamMembers.length;
      expValues.teamMembers = _.join(teamMembers, ', ');

      rows.push(expValues);
      eachCallback();
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};
