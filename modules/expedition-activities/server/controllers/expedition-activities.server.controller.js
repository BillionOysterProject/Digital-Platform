'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ExpeditionActivity = mongoose.model('ExpeditionActivity'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an expedition activity
 */
exports.create = function (req, res) {
  var activity = new ExpeditionActivity(req.body);
  activity.user = req.user;

  activity.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activity);
    }
  });
};

/**
 * Show the current expedition activity
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var activity = req.activity ? req.activity.toJSON() : {};

  res.json(activity);
};

/**
 * List of Expedition Activities
 */
exports.list = function (req, res) {
  var getQuery = function(teamIds) {
    var query;
    var and = [];

    if (req.query.teamId) {
      and.push({ 'team': req.query.teamId });
    }

    if (teamIds) {
      and.push({ 'team': { $in: teamIds } });
    }

    if (and.length === 1) {
      query = ExpeditionActivity.find(and[0]);
    } else if (and.length > 0) {
      query = ExpeditionActivity.find({ $and : and });
    } else {
      query = ExpeditionActivity.find();
    }

    if (req.query.sort) {

    } else {
      query.sort('-created');
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
    .populate('team', 'name')
    .populate('expedition', 'name status monitoringStartDate');

    return query;
  };


  if (req.query.byOwner) {
    Team.find({ 'teamLead': req.user }).exec(function(err, teams) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!teams) {
        return res.status(400).send({
          message: 'User does not have teams'
        });
      } else {
        var teamIds = [];
        for (var i = 0; i < teams.length; i++) {
          teamIds.push(teams[i]._id);
        }
        var query = getQuery(teamIds);
        query.exec(function (err, activities) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(activities);
          }
        });
      }
    });
  } else {
    var query = getQuery();
    query.exec(function (err, activities) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(activities);
      }
    });
  }

};

/**
 * Expedition Activity middleware
 */
exports.expeditionActivityByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Activity is invalid'
    });
  }

  ExpeditionActivity.findById(id).exec(function (err, activity) {
    if (err) {
      return next(err);
    } else if (!activity) {
      return res.status(404).send({
        message: 'No activity with that identifier has been found'
      });
    }
    req.activity = activity;
    next();
  });
};
