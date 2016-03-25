'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a team
 */
exports.create = function (req, res) {
  var team = new Team(req.body);
  team.teamLead = req.user;

  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * Show the current team
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var team = req.team ? req.team.toJSON() : {};

  // Add a custom field to the Team, for determining if the current User is the "lead".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Team model.
  team.isCurrentUserTeamLead = req.user && team.teamLead && team.teamLead._id && team.teamLead._id.toString() === req.user._id.toString() ? true : false;

  res.json(team);
};

/**
 * Update a team
 */
exports.update = function (req, res) {
  var team = req.team;

  if (team) {
    team = _.extend(team, req.body);

    team.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(team);
      }
    });
  }
};

/**
 * Delete a team
 */
exports.delete = function (req, res) {
  var team = req.team;

  team.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/** 
 * List of Teams
 */
exports.list = function (req, res) {
  var query;
  var and = [];

  if (req.query.byOwner) {
    and.push({ 'teamLead': req.user });
  }
  if (req.query.byMember) {
    and.push({ 'teamMembers': req.user });
  }
  if (req.query.teamId) {
    and.push({ '_id': req.query.teamId });
  }

  if (and.length === 1) {
    query = Team.find(and[0]);
  } else if (and.length > 0) {
    query = Team.find({ $and: and });
  } else {
    query = Team.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'owner') {
      query.sort({ 'teamLead': 1, 'name': 1 });
    }
  } else {
    query.sort('name');
  }

  if (req.query.limit) {
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.populate('teamMembers', 'displayName username email profileImageURL')
  .populate('teamLead', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

exports.listMembers = function (req, res) {
  var query;
  var and = [];

  if (req.query.byOwner) {
    and.push({ 'teamLead': req.user });
  }
  if (req.query.teamId) {
    and.push({ '_id': req.query.teamId });
  }
  
  var searchRe;
  var or = [];
  if (req.query.searchString) {
    searchRe = new RegExp(req.query.searchString, 'i');
    or.push({ 'displayName': searchRe });
    or.push({ 'email': searchRe });
    or.push({ 'username': searchRe }); 
    
    and.push({ $or: or });
  }

  if (and.length === 1) {
    query = Team.find(and[0]);
  } else if (and.length > 0) {
    query = Team.find({ $and: and });
  } else {
    query = Team.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'owner') {
      query.sort({ 'teamLead': 1, 'name': 1 });
    }
  } else {
    query.sort('name');
  }

  if (req.query.limit) {
    if (req.query.page) {
      var limit = Number(req.query.limit);
      var page = Number(req.query.page);
      query.skip(limit*(page-1)).limit(limit);
    }
  } else {
    var limit = Number(req.query.limit);
    query.limit(limit);
  }

  query.populate('teamMembers', 'displayName username email profileImageURL')
  .populate('teamLead', 'displayName').exec(function (err, teams) {
    if (err) {
      console.log('error', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var members = [];
      for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        for (var j = 0; j < team.teamMembers.length; j++) {
          var member = team.teamMembers[j];
          member.team = {
            name: team.name,
            _id: team._id
          };
          members.push(member);
        }
      }
      res.json(members);
    }
  });
};

/**
 * Team middleware
 */
exports.teamByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }

  Team.findById(id).populate('user', 'displayName').exec(function (err, team) {
    if (err) {
      return next(err);
    } else if (!team) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    }
    req.team = team;
    next();
  });
};