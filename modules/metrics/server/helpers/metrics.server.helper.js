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
  Team = mongoose.model('Team'),
  Research = mongoose.model('Research'),
  ResearchActivity = mongoose.model('ResearchActivity'),
  CalendarEvent = mongoose.model('CalendarEvent');

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
      label: 'Expeditions created',
      value: 'expeditionsCreateCount'
    }, {
      label: 'Expeditions published',
      value: 'expeditionsPublishedCount'
    }, {
      label: 'Lessons viewed',
      value: 'lessonsViewedCount'
    }, {
      label: 'Lessons logged',
      value: 'lessonsLoggedCount'
    }, {
      label: 'Lessons reviewed',
      value: 'lessonFeedbackCount'
    }, {
      label: 'Lessons created (forked or new)',
      value: 'lessonsCreatedCount'
    }, {
      label: 'teams',
      value: 'teamCount'
    }, {
      label: 'total team members',
      value: 'totalTeamMemberCount'
    }, {
      label: 'total research posters published by team members',
      value: 'totalPostersByTeamMembers'
    }, {
      label: 'research posters published by self',
      value: 'totalPostersBySelf'
    }, {
      label: 'Events registered',
      value: 'eventsRegisteredCount'
    }, {
      label: 'Events attended',
      value: 'eventsAttendedCount'
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
        Expedition.aggregate([
          { $match: { 'teamLead': user._id } },
          { $group: {
            _id: null,
            createdCount: { $sum: 1 },
            publishedCount: { $sum: { $cond: [ { $eq: ['$status', 'published'] }, 1, 0 ] } }
          } }
        ], function(err1, expeditionResults) {
          if (expeditionResults && expeditionResults.length === 1) {
            userValues.expeditionsCreateCount = expeditionResults[0].createdCount;
            userValues.expeditionsPublishedCount = expeditionResults[0].publishedCount;
          } else {
            userValues.expeditionsCreateCount = 0;
            userValues.expeditionsPublishedCount = 0;
          }
          Lesson.count({ 'user': user._id }).exec(function(err2, lessonsCreatedCount) {
            userValues.lessonsCreatedCount = (lessonsCreatedCount) ? lessonsCreatedCount : 0;
            LessonActivity.aggregate([
              { $match: { 'user': user._id } },
              { $group: {
                _id: null,
                lessonsViewedCount: { $sum: { $cond: [ { $eq: ['$activity', 'viewed'] }, 1, 0 ] } },
                lessonsLoggedCount: { $sum: { $cond: [ { $eq: ['$activity', 'taught'] }, 1, 0 ] } },
                lessonFeedbackCount: { $sum: { $cond: [ { $eq: ['$activity', 'feedback'] }, 1, 0 ] } }
              } }
            ], function(err3, lessonActivityResults) {
              if (lessonActivityResults && lessonActivityResults.length === 1) {
                userValues.lessonsViewedCount = lessonActivityResults[0].lessonsViewedCount;
                userValues.lessonsLoggedCount = lessonActivityResults[0].lessonsLoggedCount;
                userValues.lessonFeedbackCount = lessonActivityResults[0].lessonFeedbackCount;
              } else {
                userValues.lessonsViewedCount = 0;
                userValues.lessonsLoggedCount = 0;
                userValues.lessonFeedbackCount = 0;
              }
              Team.find({ 'teamLeads': user._id }).exec(function(err4, teams) {
                var teamMembers = [];
                if (teams && teams.length > 0) {
                  userValues.teamCount = teams.length;
                  for(var i = 0; i < teams.length; i++) {
                    teamMembers = teamMembers.concat(teams[i].teamMembers);
                  }
                  teamMembers = _.uniq(teamMembers);
                  userValues.totalTeamMemberCount = teamMembers.length;
                } else {
                  userValues.teamCount = 0;
                  userValues.totalTeamMemberCount = 0;
                }
                Research.count({ 'user': { $in: teamMembers } }).exec(function(err5, teamPosterCount) {
                  if (teamPosterCount) {
                    userValues.totalPostersByTeamMembers = teamPosterCount;
                  } else {
                    userValues.totalPostersByTeamMembers = 0;
                  }
                  Research.count({ 'user': user._id }).exec(function(err6, selfPosterCount) {
                    if (selfPosterCount) {
                      userValues.totalPostersBySelf = selfPosterCount;
                    } else {
                      userValues.totalPostersBySelf = 0;
                    }
                    CalendarEvent.aggregate([
                      { $match: { 'registrants.user': user._id } },
                      { $group: {
                        _id: null,
                        eventsRegisteredCount: { $sum: 1 }
                      } }
                    ], function(err7, eventsRegistered) {
                      if (eventsRegistered && eventsRegistered.length === 1) {
                        userValues.eventsRegisteredCount = eventsRegistered[0].eventsRegisteredCount;
                      } else {
                        userValues.eventsRegisteredCount = 0;
                      }
                      CalendarEvent.aggregate([
                        { '$match': {
                          'registrants': {
                            '$elemMatch': {
                              'user': user._id,
                              'attended': true
                            }
                          }
                        } },
                        { '$unwind': '$registrants' },
                        { '$match': {
                          'registrants.user': user._id,
                          'registrants.attended': true
                        } },
                        { '$group': {
                          _id: null,
                          eventsAttendedCount: { $sum: 1 }
                        } }
                      ], function(err8, eventsAttended) {
                        if (eventsAttended && eventsAttended.length === 1) {
                          userValues.eventsAttendedCount = eventsAttended[0].eventsAttendedCount;
                        } else {
                          userValues.eventsAttendedCount = 0;
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
    }, function(err) {
      callback(rows, csvFields);
    });
  });
};

exports.teamMemberStats = function(callback) {
  // Team member,	email,	team,	org,	expeditions invited,	protocols submitted,	protocols published,
  // research published,	research reviewed
};

exports.organizationStats = function(callback) {
  // Org,	Address,	City,	State,	Zip,	org type,	Expeditions created,	Expeditions published,	Lessons viewed,
  // Lessons logged,	Lessons reviewed,	 Lessons created (forked or new),	teams,	total team members,
  // total research posters published by all team members,	research posters published by team leads,	events registered,
  // events attended
};

exports.eventStats = function(callback) {
  // Events,	start date,	location,	capacity,	page views,	registered,	attended,	waitlisted,	unregistered
};

exports.lessonStats = function(callback) {
  // Lesson,	units,	views,	downloads,	reviews,	rating - overall,	rating - standards,	rating - inquiry,
  // rating - restoration,	total classes taught,	total students taught
};
