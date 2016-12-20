'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  _ = require('lodash'),
  crypto = require('crypto');

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.teamLeadType = req.body.teamLeadType;
  user.schoolOrg = req.body.schoolOrg;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

var hasRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var isAdmin = function(user) {
  return hasRole(user, 'admin');
};

exports.approve = function (req, res) {
  var user = req.model;

  if (isAdmin(req.user)) {
    var index = _.findIndex(user.roles, function(r) {
      return r === 'team lead pending';
    });
    if (index > -1) {
      user.roles.splice(index, 1);
    }
    user.roles.push('team lead');

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

        email.sendEmailTemplate(user.email, 'Your request to be a Team Lead  on The Billion Oyster Project was approved',
        'lead_approved', {
          FirstName: user.firstName,
          LinkLogin: httpTransport + req.headers.host + '/authentication/signin',
          LinkProfile: httpTransport + req.headers.host + '/settings/profile'
        }, function(info) {
          res.json(user);
        }, function(errorMessage) {
          res.json(user);
        });
      }
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
    });
  }
};

exports.deny = function(req, res) {
  var user = req.model;

  if (isAdmin(req.user)) {
    user.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(user);
    });
  } else {
    return res.status(403).send({
      message: 'Permission denied'
    });
  }
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  var query;
  var and = [];

  if (req.query.role && req.query.role !== undefined && req.query.role !== null && req.query.role !== '') {
    and.push({ 'roles': req.query.role });
  } else if (req.query.searchString) {
    and.push({ $or: [{ 'roles': 'admin' }, { 'roles': 'team lead' }, { 'roles': 'team lead pending' },
    { 'roles': 'team member' }, { 'roles': 'team member pending' }, { 'roles': 'partner' }] });
  } else {
    and.push({ $or: [{ 'roles': 'admin' }, { 'roles': 'team lead' }, { 'roles': 'team lead pending' }] });
  }

  if (req.query.organizationId) {
    and.push({ 'schoolOrg': req.query.organizationId });
  }

  var searchRe;
  var or = [];
  if (req.query.searchString) {
    try {
      searchRe = new RegExp(req.query.searchString, 'i');
    } catch(e) {
      return res.status(400).send({
        message: 'Search string is invalid'
      });
    }

    or.push({ 'displayName': searchRe });
    or.push({ 'firstName': searchRe });
    or.push({ 'lastName': searchRe });
    or.push({ 'email': searchRe });
    or.push({ 'username': searchRe });

    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = User.find(and[0], '-salt -password');
  } else if (and.length > 0) {
    query = User.find({ $and: and }, '-salt -password');
  } else {
    query = User.find({}, '-salt -password');
  }

  if (req.query.sort) {
    if (req.query.sort === 'firstName') {
      query.sort({ 'firstName': 1 });
    } else if (req.query.sort === 'lastName') {
      query.sort({ 'lastName': 1 });
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

  query.populate('user', 'displayName email roles profileImageURL')
  .populate('schoolOrg', 'name pending').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if (req.query.showTeams) {
      if (users && users.length > 0) {
        var findTeams = function(user, callback) {
          var queryTeam;
          if (hasRole(user, 'team member')) {
            queryTeam = Team.find({ 'teamMembers': user });
          } else {
            queryTeam = Team.find({ 'teamLead': user });
          }
          queryTeam.populate('teamMembers', 'displayName profileImageURL email username')
          .populate('teamLead', 'displayName profileImageURL email')
          .populate('schoolOrg', 'name')
          .exec(function(err, teams) {
            callback(teams);
          });
        };

        var findTeamsForUsers = function(index, users, updatedUsers, callback) {
          if (index < users.length) {
            findTeams(users[index], function(teams) {
              var user = users[index] ? users[index].toJSON() : {};
              if (teams && teams.length) {
                user.teams = teams;
              }
              updatedUsers.push(user);
              findTeamsForUsers(index+1, users, updatedUsers, callback);
            });
          } else {
            callback(updatedUsers);
          }
        };

        findTeamsForUsers(0, users, [], function(updatedUsers) {
          res.json(updatedUsers);
        });
      } else {
        res.json(users);
      }
    } else {
      res.json(users);
    }
  });
};

/**
 * List of Team Leads
 */
exports.listTeamLeads = function (req, res) {
  var query;
  var and = [{ 'roles': 'team lead' }];

  if (req.query.organizationId) {
    and.push({ 'schoolOrg': req.query.organizationId });
  }

  if (and.length === 1) {
    query = User.find(and[0], '-salt -password');
  } else if (and.length > 0) {
    query = User.find({ $and: and }, '-salt -password');
  } else {
    query = User.find({}, '-salt -password');
  }

  if (req.query.sort) {
    if (req.query.sort === 'firstName') {
      query.sort({ 'firstName': 1 });
    } else if (req.query.sort === 'lastName') {
      query.sort({ 'lastName': 1 });
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

  query.populate('user', 'displayName email profileImageURL')
  .populate('schoolOrg', 'name pending').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};


/**
 * User middleware
 */
exports.userByUsername = function (req, res) {
  var username = req.query.username;

  User.findOne({ 'username': username }, '-salt -password').populate('schoolOrg').exec(function (err, user) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      res.json(user);
    }
  });
};

exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').populate('schoolOrg').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

// inviting users
var createUserInviteInternal = function(userJSON, schoolOrg, role, successCallback, errorCallback) {
  User.findOne({ 'email': userJSON.email }).exec(function(userErr, user) {
    if (userErr) {
      errorCallback(errorHandler.getErrorMessage(userErr));
    } else if (user) {
      successCallback(user);
    } else {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        // create user
        user = new User(userJSON);
        user.provider = 'local';
        user.displayName = user.firstName + ' ' + user.lastName;
        user.roles = [role, 'user'];
        user.pending = true;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days
        user.schoolOrg = schoolOrg;
        if (!user.username) user.username = user.email.substring(0, user.email.indexOf('@'));

        // Then save the user
        user.save(function (err) {
          if (err) {
            errorCallback(errorHandler.getErrorMessage(err));
          } else {
            successCallback(user, token);
          }
        });
      });
    }
  });
};

var sendInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + leadName + ' to join the ' + teamOrOrg + ' ' + teamOrOrgName,
  'member_invite', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token
  }, function(info) {
    successCallback(info);
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var sendExistingInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'You\'ve been invited by ' + leadName + ' to join the team ' + teamOrOrg + ' ' + teamOrOrgName,
  'member_existing_invite', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    LinkLogin: httpTransport + host + '/authentication/signin'
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

var addToTeamOrOrg = function(user, team, schoolOrg, role, teamOrOrg, successCallback, errorCallback) {
  if (teamOrOrg === 'team') {
    var teamId = (team && team._id) ? team._id : team;
    Team.findById(teamId).exec(function(err, team) {
      if (err) {
        errorCallback(err);
      } else {
        if (role === 'team member pending') {
          team.teamMembers.push(user);
        } else if (role === 'team lead pending') {
          team.teamLeads.push(user);
        }
        team.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(team, schoolOrg);
        });
      }
    });
  } else if (teamOrOrg === 'organization') {
    role = 'team lead pending';
    var schoolOrgId = (schoolOrg && schoolOrg._id) ? schoolOrg._id : schoolOrg;
    SchoolOrg.findById(schoolOrgId).exec(function(err, schoolOrg) {
      if (err) {
        errorCallback(err);
      } else {
        schoolOrg.orgLeads.push(user);
        schoolOrg.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(null, schoolOrg);
        });
      }
    });
  }
};

exports.createUserInvite = function (req, res) {
  delete req.body.user.roles;
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;

  createUserInviteInternal(req.body.user, req.body.organization, role,
    function(user, token) {
      addToTeamOrOrg (user, req.body.team, req.body.organization, role, teamOrOrg,
        function(team, schoolOrg) {
          var teamOrOrgName = (teamOrOrg === 'team' && team) ? team.name : schoolOrg.name;
          if (token) {
            sendInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, token,
              function() {
                res.json(user);
              }, function() {
                res.json(user);
              });
          } else {
            sendExistingInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName,
              function() {
                res.json(user);
              }, function() {
                res.json(user);
              });
          }
        }, function(errorMessage) {
          return res.status(400).send({
            message: errorMessage
          });
        });
    }, function(errorMessage) {
      return res.status(400).send({
        message: errorMessage
      });
    });
};

var sendReminderInviteEmail = function(user, host, leadName, teamOrOrg, teamOrOrgName, token, successCallback, errorCallback) {
  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  email.sendEmailTemplate(user.email, 'Reminder: You\'ve been invited by ' + leadName + ' to join the team ' + teamOrOrg + ' ' + teamOrOrgName,
  'invite_reminder', {
    FirstName: user.firstName,
    LeadName: leadName,
    TeamOrOrg: teamOrOrg,
    TeamOrOrgName: teamOrOrgName,
    LinkCreateAccount: httpTransport + host + '/api/auth/claim-user/' + token
  }, function(info) {
    successCallback();
  }, function(errorMessage) {
    errorCallback('Failure sending email');
  });
};

exports.remindInvitee = function (req, res) {
  var user = req.member;
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;
  var team = req.body.team;
  var schoolOrg = req.body.organization;

  var teamOrOrgName = (teamOrOrg === 'team' && team) ? team.name : schoolOrg.name;
  if (user.resetPasswordToken) {
    sendReminderInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, user.resetPasswordToken,
      function() {
        res.json(user);
      }, function(errorMessage) {
        res.json(user);
      });
  } else {
    if (user.pending === true) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        // update user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (86400000 * 30); //30 days

        // Then save the user
        user.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            sendReminderInviteEmail(user, req.headers.host, req.user.displayName, teamOrOrg, teamOrOrgName, token,
              function() {
                res.json(user);
              }, function(errorMessage) {
                res.json(user);
              });
          }
        });
      });
    }
  }
};

var removeFromArray = function(user, array) {
  var index = _.findIndex(array, function(n) {
    var id = (n && n._id) ? n._id : n;
    return id.toString() === user._id.toString();
  });
  array.splice(index, 1);
  return array;
};

var removeFromTeamOrOrg = function(user, team, schoolOrg, role, teamOrOrg, successCallback, errorCallback) {
  if (teamOrOrg === 'team') {
    var teamId = (team && team._id) ? team._id : team;
    Team.findById(teamId).exec(function(err, team) {
      if (err) {
        errorCallback(err);
      } else {
        if (role === 'team member pending' || role === 'team member') {
          team.teamMembers = removeFromArray(user, team.teamMembers);
        } else if (role === 'team lead pending' || role === 'team lead') {
          team.teamLeads = removeFromArray(user, team.teamLeads);
        }
        team.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(team, schoolOrg);
        });
      }
    });
  } else if (teamOrOrg === 'organization') {
    var schoolOrgId = (schoolOrg && schoolOrg._id) ? schoolOrg._id : schoolOrg;
    SchoolOrg.findById(schoolOrgId).exec(function(err, schoolOrg) {
      if (err) {
        errorCallback(err);
      } else {
        schoolOrg.orgLeads = removeFromArray(user, schoolOrg.orgLeads);
        schoolOrg.save(function(err) {
          if (err) {
            errorCallback(err);
          }
          successCallback(null, schoolOrg);
        });
      }
    });
  }
};

exports.deleteUserLeader = function (req, res) {
  var user = req.member;
  var teamOrOrg = req.body.teamOrOrg;
  var role = req.body.role;

  removeFromTeamOrOrg (user, req.body.team, req.body.organization, role, teamOrOrg,
    function(team, schoolOrg) {
      res.json(user);
    }, function(errorMessage) {
      return res.status(400).send({
        message: errorMessage
      });
    });
};

exports.leaderByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Member is invalid'
    });
  }

  User.findById(id).exec(function (err, member) {
    if (err) {
      return next(err);
    } else if (!member) {
      return res.status(404).send({
        message: 'No member with that identifier has been found'
      });
    }
    req.member = member;
    next();
  });
};
