'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  TeamRequest = mongoose.model('TeamRequest'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a team request
 */
exports.create = function (req, res) {
  var teamRequest = new TeamRequest(req.body);
  teamRequest.requester = req.body;

  teamRequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teamRequest);
    }
  });
};

/**
 * Show the current team request
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var teamRequest = req.teamRequest ? req.teamRequest.toJSON() : {};

  res.json(teamRequest);
};

/**
 * Update a team request
 */
exports.update = function (req, res) {
  var teamRequest = req.teamRequest;

  if (teamRequest) {
    teamRequest = _.extend(teamRequest, req.body);

    teamRequest.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(teamRequest);
      }
    });
  }
};

/**
 * Delete a team request
 */
exports.delete = function (req, res) {
  var teamRequest = req.teamRequest;

  teamRequest.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teamRequest);
    }
  });
};

exports.approve = function (req, res) {
  var teamRequest = req.teamRequest;

  var updateTeamAndDeleteRequest = function(team, teamRequest) {
    team.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        teamRequest.remove(function(delErr) {
          if (delErr) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(delErr)
            });
          } else {
            res.json(teamRequest);
          }
        });
      }
    });
  };

  if (req.body.newTeamName) {
    var teamJSON = {
      name: req.body.newTeamName,
      schoolOrg: req.user.schoolOrg,
      teamMembers: [teamRequest.requester]
    };

    var team = new Team(teamJSON);
    updateTeamAndDeleteRequest(team, teamRequest);

  } else if (req.body.teamId) {
    Team.findById(req.body.teamId).exec(function(errTeam, team) {
      if (errTeam || !team) {
        return res.status(400).send({
          message: 'Error adding member to team'
        });
      } else {
        team.teamMembers.push(teamRequest.requester);

        updateTeamAndDeleteRequest(team, teamRequest);
      }
    });
  } else {
    return res.status(400).send({
      message: 'Must provide a team for the member'
    });
  }
};

exports.list = function(req, res) {
  var query;
  var and = [];

  if (req.query.byOwner) {
    and.push({ 'teamLead': req.user });
  }
  if (req.query.byMember) {
    and.push({ 'requester': req.user });
  }

  if (and.length === 1) {
    query = TeamRequest.find(and[0]);
  } else if (and.length > 0) {
    query = TeamRequest.find({ $and: and });
  } else {
    query = TeamRequest.find();
  }

  if (req.query.sort) {
    if (req.query.sort === 'owner') {
      query.sort({ 'teamLead.displayName': 1, 'requester.displayName': 1 });
    }
  } else {
    query.sort('requester.displayName');
  }

  if (req.query.limit) {
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.populate('requester', 'displayName email').exec(function(err, teamRequests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teamRequests);
    }
  });
};

/**
 * Team Request middleware
 */
exports.teamRequestByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team Request is invalid'
    });
  }

  TeamRequest.findById(id).populate('requester').exec(function (err, teamRequest) {
    if (err) {
      return next(err);
    } else if (!teamRequest) {
      return res.status(400).send({
        message: 'No team request with that identifier has been found'
      });
    }
    req.teamRequest = teamRequest;
    next();
  });
};
