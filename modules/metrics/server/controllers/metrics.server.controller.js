'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserActivity = mongoose.model('UserActivity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  lodash = require('lodash');

/**
 * Calculate metrics related to people using the system
 */
exports.getPeopleMetrics = function(req, res) {
  var peopleMetrics = {};

  var userCountQuery = User.count({
    $or: [
      { pending: false },
      { pending: { $exists: false } }
    ] }
  );

  var adminCountQuery = User.count({
    $and: [
      { roles: 'admin' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  var teamLeadCountQuery = User.count({
    $and: [
      { roles: 'team lead' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  var teamMemberCountQuery = User.count({
    $and: [
      { roles: 'team member' },
      { $or: [
        { pending: false },
        { pending: { $exists: false } }
      ] }
    ] }
  );

  userCountQuery.exec(function(err, userCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      peopleMetrics.userCount = userCount;
      adminCountQuery.exec(function(err, adminCount) {
        if (err) {
          return res.stats(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          peopleMetrics.adminCount = adminCount;
          teamLeadCountQuery.exec(function(err, teamLeadCount) {
            if (err) {
              return res.stats(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              peopleMetrics.teamLeadCount = teamLeadCount;
              teamMemberCountQuery.exec(function(err, teamMemberCount) {
                if (err) {
                  return res.stats(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  peopleMetrics.teamMemberCount = teamMemberCount;
                  res.json(peopleMetrics);
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.getMostActiveUsers = function(req, res) {
  var groupBy = {
    $group: {
      _id: {
        user: '$user',
        activity: '$activity'
      } ,
      loginCount: {
        $sum: 1
      }
    }
  };
  var match = {
    $match: {
      activity: 'login'
    }
  };
  var startDate, endDate;
  if(req.query.startDate) {
    startDate = moment(req.query.startDate).toDate();
  }
  if(req.query.endDate) {
    endDate = moment(req.query.endDate).toDate();
  }

  if(startDate !== null && startDate !== undefined &&
    endDate !== null && endDate !== undefined) {
    match.$match.created = {
      $gte: startDate,
      $lt: endDate
    };
  } else if(startDate !== null && startDate !== undefined) {
    match.$match.created = {
      $gte: startDate
    };
  } else if(endDate !== null && endDate !== undefined) {
    match.$match.created = {
      $lt: endDate
    };
  }

  var activeUsersQuery = UserActivity.aggregate([
    match, groupBy
  ]);
  activeUsersQuery.exec(function(err, data) {
    if (err) {
      return res.stats(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //TODO: figure out how to get user display name, teams (they are leads of? members of?)
      //number of members on the team, and the organization
      res.json(data);
    }
  });
};
