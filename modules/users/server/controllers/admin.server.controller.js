'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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

/**
 * List of Users
 */
exports.list = function (req, res) {
  var searchUsers = function(userIds) {
    var query;
    var and = [];

    if (req.query.role) {
      and.push({ 'roles': req.query.role });
    } else {
      and.push({ $or: [{ 'roles': 'admin' }, { 'roles': 'team lead' }, { 'roles': 'team lead pending' }] });
    }

    if (userIds && userIds.length > 0) {
      and.push({ '_id': { $in: userIds } });
    }

    var searchRe;
    var or = [];
    if (req.query.searchString) {
      searchRe = new RegExp(req.query.searchString, 'i');
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

    query.populate('user', 'displayName email profileImageURL').exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      if (req.query.showTeams) {
        if (users && users.length) {
          var findTeams = function(user, callback) {
            Team.find({ 'teamLead': user }).populate('schoolOrg', 'name').populate('teamMembers', 'displayName')
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
                  user.schoolOrg = teams[0].schoolOrg.name;
                }
                console.log('user', user);
                updatedUsers.push(user);
                findTeamsForUsers(index+1, users, updatedUsers, callback);
              });
            } else {
              callback(updatedUsers);
            }
          };

          findTeamsForUsers(0, users, [], function(updatedUsers) {
            console.log('users', updatedUsers);
            res.json(updatedUsers);
          });
        }
      } else {
        res.json(users);
      }
    });
  };

  if (req.query.organizationId) {
    Team.find({ 'schoolOrg': req.query.organizationId }).exec(function(err, teams) {
      if (teams && teams.length > 0) {
        var userIds = [];
        for (var i = 0; i < teams.length; i++) {
          var team = teams[i];
          userIds.push(team.teamLead);
          for (var j = 0; j < team.teamMembers.length; j++) {
            userIds.push(team.teamMembers[j]);
          }
        }
        searchUsers(userIds);
      } else {
        return res.status(400).send({
          message: 'Organization does not have any members'
        });
      }
    });
  } else {
    searchUsers();
  }
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
