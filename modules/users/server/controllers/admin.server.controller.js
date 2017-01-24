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
  _ = require('lodash');

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

var hasRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var isAdmin = function(user) {
  return hasRole(user, 'admin');
};

//call this when appropriate references to the user have been deleted
//and it's safe to remove the object from the user table
var deleteUserInternal = function(user, res) {
  user.remove(function (err) {
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

  //TODO: should we be deleting everything in the db that the user did???
  //like useractivities, expeditions, protocols, expeditionactivities, glosarries,
  //lessons, event registration/attendance???

  //check if the user is a team lead or team member
  if(hasRole(user, 'team lead') || hasRole(user, 'team lead pending') || hasRole(user, 'admin')) {
    //if the user is a team lead and they are associated with any teams,
    //throw an error that we cannot delete them. The team must be
    //deleted or assigned to another user as teamLead before we could delete this user.

    //TODO: this will have to change when teams can have multiple leads
    Team.find({ 'teamLead': user._id }).exec(function(err, team) {
      if (err) {
        return res.status(400).send({
          message: 'Could not find teams associated with team lead ' + user.displayName +
            '. Error is: ' + errorHandler.getErrorMessage(err)
        });
      } else {
        if(team !== null && team !== undefined && team.length > 0) {
          return res.status(400).send({
            message: 'User ' + user.displayName + ' is a team lead for ' + team.name + '. ' +
            'The team must be deleted or re-assigned to a different team lead before this ' +
            'user can be deleted.'
          });
        } else {
          deleteUserInternal(user, res);
        }
      }
    });
  } else if(hasRole(user, 'team member') || hasRole(user, 'team member pending')) {
    //if the user is a team member, delete the reference to them from the
    //teamMembers list in the Team model
    Team.find({ 'teamMembers': user._id }).exec(function(err, teams) {
      if (err) {
        return res.status(400).send({
          message: 'Could not find teams associated with user ' + user.displayName +
            '. Error is: ' + errorHandler.getErrorMessage(err)
        });
      } else {
        var memberIndex = function(member, team) {
          var index = _.findIndex(team.teamMembers, function(m) {
            return m.toString() === member._id.toString();
          });
          return index;
        };
        var delTeamMember = function(user, team) {
          team.save(function (delSaveErr) {
            if (delSaveErr) {
              return res.status(400).send({
                message: 'Could not delete user as member from team ' + team.name + '. Error is: ' + delSaveErr
              });
            } else {
              deleteUserInternal(user, res);
            }
          });
        };
        if(teams === null || teams === undefined || teams.length === 0) {
          deleteUserInternal(user, res);
        } else {
          for(var i = 0; i < teams.length; i++) {
            var team = teams[i];
            var index = memberIndex(user, team);
            if(index > -1) {
              team.teamMembers.splice(index, 1);
              delTeamMember(user, team);
            }
          }
        }
      }
    });
  }
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
  } else {
    and.push({ $or: [{ 'roles': 'admin' }, { 'roles': 'team lead' }, { 'roles': 'team lead pending' },
    { 'roles': 'team member' }, { 'roles': 'team member pending' }, { 'roles': 'partner' }] });
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
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
