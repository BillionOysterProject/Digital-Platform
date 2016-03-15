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

exports.readOwner = function (req, res) {
  Team.findOne({ teamLead: req.user }).populate('user', 'displayName').exec(function (err, found) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!found) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    } else {
      var team = found ? found.toJSON() : {};
      team.isCurrentUserTeamLead = true;

      res.json(team);
    }
  });
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

exports.updateOwner = function (req, res) {
  Team.findOne({ teamLead: req.user }).populate('user', 'displayName').exec(function (err, team) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!team) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    } else {
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
  });
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
  Team.find().sort('name').populate('user', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
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