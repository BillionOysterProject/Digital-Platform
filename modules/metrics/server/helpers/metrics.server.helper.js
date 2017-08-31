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
      label: 'Submitted Site Condition Protocols',
      value: 'p1submittedCount'
    }, {
      label: 'Submitted Oyster Measurement Protocols',
      value: 'p2submittedCount'
    }, {
      label: 'Submitted Mobile Trap Protocols',
      value: 'p3submittedCount'
    }, {
      label: 'Submitted Settlement Tile Protocols',
      value: 'p4submittedCount'
    }, {
      label: 'Submitted Water Quality Protocols',
      value: 'p5submittedCount'
    }, {
      label: 'Published Site Condition Protocols',
      value: 'p1publishedCount'
    }, {
      label: 'Published Oyster Measurement Protocols',
      value: 'p2publishedCount'
    }, {
      label: 'Published Mobile Trap Protocols',
      value: 'p3publishedCount'
    }, {
      label: 'Published Settlement Tile Protocols',
      value: 'p4publishedCount'
    }, {
      label: 'Published Water Quality Protocols',
      value: 'p5publishedCount'
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
            userValues.schoolOrgs = _.join(_.uniq(orgs.concat(_.map(teams, 'schoolOrg.name'))), ', ');
            userValues.schoolOrgsCount = userValues.schoolOrgs.length;
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
            var countProtocols = [
              { $unwind: '$teamLists.siteCondition' },
              { $unwind: '$teamLists.oysterMeasurement' },
              { $unwind: '$teamLists.mobileTrap' },
              { $unwind: '$teamLists.settlementTiles' },
              { $unwind: '$teamLists.waterQuality' },
              { $group: { _id: null,
                site: { $sum: { $cond: [{ $eq: ['$teamLists.siteCondition', user._id] }, 1, 0] } },
                oyster: { $sum: { $cond: [{ $eq: ['$teamLists.oysterMeasurement', user._id] }, 1, 0] } },
                mobile: { $sum: { $cond: [{ $eq: ['$teamLists.mobileTrap', user._id] }, 1, 0] } },
                tiles: { $sum: { $cond: [{ $eq: ['$teamLists.settlementTiles', user._id] }, 1, 0] } },
                water: { $sum: { $cond: [{ $eq: ['$teamLists.waterQuality', user._id] }, 1, 0] } }
              } }
            ];
            var pubCountQuery = _.concat([{ $match: { 'status': 'published' } }], countProtocols);
            var subCountQuery = _.concat([{ $match: { 'status': { $ne: 'incomplete' } } }], countProtocols);
            Expedition.aggregate(pubCountQuery).exec(function(err4, pubProResult) {
              Expedition.aggregate(subCountQuery).exec(function(err5, subProResult) {
                ProtocolSiteCondition.aggregate([{ $match: { teamMembers: user._id } },
                { $group: { _id: null,
                  pub: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                  sub: { $sum: { $cond: [{ $ne: ['$status', 'published'] }, 1, 0] } }
                } }]).exec(function(err6, siteResults) {
                  ProtocolOysterMeasurement.aggregate([{ $match: { teamMembers: user._id } },
                  { $group: { _id: null,
                    pub: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                    sub: { $sum: { $cond: [{ $ne: ['$status', 'published'] }, 1, 0] } }
                  } }]).exec(function(err7, oysterResults) {
                    ProtocolMobileTrap.aggregate([{ $match: { teamMembers: user._id } },
                    { $group: { _id: null,
                      pub: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                      sub: { $sum: { $cond: [{ $ne: ['$status', 'published'] }, 1, 0] } }
                    } }]).exec(function(err8, mobileResults) {
                      ProtocolSettlementTile.aggregate([{ $match: { teamMembers: user._id } },
                      { $group: { _id: null,
                        pub: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                        sub: { $sum: { $cond: [{ $ne: ['$status', 'published'] }, 1, 0] } }
                      } }]).exec(function(err9, tilesResults) {
                        ProtocolWaterQuality.aggregate([{ $match: { teamMembers: user._id } },
                        { $group: { _id: null,
                          pub: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                          sub: { $sum: { $cond: [{ $ne: ['$status', 'published'] }, 1, 0] } }
                        } }]).exec(function(err10, waterResults) {
                          if (!pubProResult || pubProResult.length === 0) {
                            pubProResult = [{ site: 0, oyster: 0, mobile: 0, tiles: 0, water: 0 }];
                          }
                          if (!subProResult || subProResult.length === 0) {
                            subProResult = [{ site: 0, oyster: 0, mobile: 0, tiles: 0, water: 0 }];
                          }
                          if (!siteResults || siteResults.length === 0) {
                            siteResults = [{ pub: 0, sub: 0 }];
                          }
                          if (!oysterResults || oysterResults.length === 0) {
                            oysterResults = [{ pub: 0, sub: 0 }];
                          }
                          if (!mobileResults || mobileResults.length === 0) {
                            mobileResults = [{ pub: 0, sub: 0 }];
                          }
                          if (!tilesResults || tilesResults.length === 0) {
                            tilesResults = [{ pub: 0, sub: 0 }];
                          }
                          if (!waterResults || waterResults.length === 0) {
                            waterResults = [{ pub: 0, sub: 0 }];
                          }
                          userValues.p1submittedCount = subProResult[0].site + siteResults[0].sub;
                          userValues.p2submittedCount = subProResult[0].oyster + oysterResults[0].sub;
                          userValues.p3submittedCount = subProResult[0].mobile + mobileResults[0].sub;
                          userValues.p4submittedCount = subProResult[0].tiles + tilesResults[0].sub;
                          userValues.p5submittedCount = subProResult[0].water + waterResults[0].sub;

                          userValues.p1publishedCount = pubProResult[0].site + siteResults[0].pub;
                          userValues.p2publishedCount = pubProResult[0].oyster + oysterResults[0].pub;
                          userValues.p3publishedCount = pubProResult[0].mobile + mobileResults[0].pub;
                          userValues.p4publishedCount = pubProResult[0].tiles + tilesResults[0].pub;
                          userValues.p5publishedCount = pubProResult[0].water + waterResults[0].pub;

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

exports.organizationStats = function(callback) {
  // Org, Address, City, State, Zip, org type, Expeditions created, Expeditions published,
  // Lessons viewed, Lessons logged, Lessons reviewed, Lessons created (forked or new), teams,
  // total team members, total research posters published by all team members,
  // research posters published by team leads, events registered, events attended
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
};
