'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  Expedition = mongoose.model('Expedition'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  ExpeditionActivity = mongoose.model('ExpeditionActivity'),
  MobileOrganism = mongoose.model('MobileOrganism'),
  SessileOrganism = mongoose.model('SessileOrganism'),
  RestorationStation = mongoose.model('RestorationStation'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  SchoolOrg = mongoose.model('SchoolOrg'),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  siteConditionHandler = require(path.resolve('./modules/protocol-site-conditions/server/controllers/protocol-site-conditions.server.controller')),
  oysterMeasurementHandler = require(path.resolve('./modules/protocol-oyster-measurements/server/controllers/protocol-oyster-measurements.server.controller')),
  mobileTrapHandler = require(path.resolve('./modules/protocol-mobile-traps/server/controllers/protocol-mobile-traps.server.controller')),
  settlementTilesHandler = require(path.resolve('./modules/protocol-settlement-tiles/server/controllers/protocol-settlement-tiles.server.controller')),
  waterQualityHandler = require(path.resolve('./modules/protocol-water-quality/server/controllers/protocol-water-quality.server.controller')),
  compareHelper = require(path.resolve('./modules/expeditions/server/helpers/compare-expeditions.server.helper')),
  moment = require('moment'),
  csv = require('fast-csv'),
  fs = require('fs'),
  async = require('async'),
  _ = require('lodash');

var checkRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var findUserInTeam = function(user, team) {
  var index = _.findIndex(team, function(u) {
    return u._id === user._id;
  });
  return (index > -1) ? true : false;
};

var findProtocols = function(user, teamLists, callback) {
  var protocols = [];
  if (findUserInTeam(user, teamLists.siteCondition)) {
    protocols.push('Site Condition');
  }
  if (findUserInTeam(user, teamLists.oysterMeasurement)) {
    protocols.push('Oyster Measurements');
  }
  if (findUserInTeam(user, teamLists.mobileTrap)) {
    protocols.push('Mobile Trap');
  }
  if (findUserInTeam(user, teamLists.settlementTiles)) {
    protocols.push('Settlement Tiles');
  }
  if (findUserInTeam(user, teamLists.waterQuality)) {
    protocols.push('Water Quality');
  }
  if (protocols.length < 1) {
    callback(null);
  } else if (protocols.length === 1) {
    callback(protocols[0]);
  } else if (protocols.length === 2) {
    callback(protocols.join(' and '));
  } else {
    protocols[protocols.length-1] = 'and ' + protocols[protocols.length-1];
    callback(protocols.join(', '));
  }
};

var getAllAssignedUsers = function(teamLists) {
  var userArray = [];
  userArray = userArray.concat(teamLists.siteCondition);
  userArray = userArray.concat(teamLists.oysterMeasurement);
  userArray = userArray.concat(teamLists.mobileTrap);
  userArray = userArray.concat(teamLists.settlementTiles);
  userArray = userArray.concat(teamLists.waterQuality);
  userArray = _.uniqWith(userArray, function(a, b) {
    return a._id.toString() === b._id.toString();
  });
  return userArray;
};

var sendEmailToAssignedUsers = function(expedition, teamLists, teamLead, subject,
  emailTemplate, emailData, successCallback, errorCallback) {
  var userArray = getAllAssignedUsers(teamLists);
  var teamMembers = _.map(userArray, 'displayName');
  teamMembers[teamMembers.length-1] = 'and ' + teamMembers[teamMembers.length-1];
  emailData.TeamMembers = teamMembers.join(', ');

  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

  async.forEach(userArray, function(user, callback) {
    findProtocols(user, teamLists, function(protocolList) {
      emailData.ExpeditionProtocols = protocolList;
      emailData.FirstName = user.firstName;
      if (user.email === teamLead.email) {
        callback();
      } else {
        email.sendEmailTemplateFromUser(user.email, teamLead.email, subject, emailTemplate, emailData,
        function(info) {
          callback();
        }, function(errorMessages) {
          callback(errorMessages);
        });
      }
    });
  }, function(err) {
    if (err) {
      errorCallback(err);
    } else {
      successCallback(null, expedition);
    }
  });
};

/**
 * Create a expedition
 */
exports.create = function (req, res) {
  var expedition = new Expedition(req.body);
  expedition.created = new Date();
  expedition.teamLead = req.user;
  expedition.monitoringStartDate = moment(req.body.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
  expedition.monitoringEndDate = moment(req.body.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

  siteConditionHandler.createInternal(expedition.monitoringStartDate, req.body.station.latitude, req.body.station.longitude, req.body.teamLists.siteCondition,
  function(siteConditionErr, siteCondition) {
    oysterMeasurementHandler.createInternal(expedition.monitoringStartDate, req.body.station.latitude, req.body.station.longitude, req.body.teamLists.oysterMeasurement,
    function(oysterMeasurementErr, oysterMeasurement) {
      mobileTrapHandler.createInternal(expedition.monitoringStartDate, req.body.station.latitude, req.body.station.longitude, req.body.teamLists.mobileTrap,
      function(mobileTrapErr, mobileTrap) {
        settlementTilesHandler.createInternal(expedition.monitoringStartDate, req.body.station.latitude, req.body.station.longitude, req.body.teamLists.settlementTiles,
        function(settlementTilesErr, settlementTiles) {
          waterQualityHandler.createInternal(expedition.monitoringStartDate, req.body.station.latitude, req.body.station.longitude, req.body.teamLists.waterQuality,
          function(waterQualityErr, waterQuality) {
            if (siteConditionErr || oysterMeasurementErr || mobileTrapErr ||
            settlementTilesErr || waterQualityErr) {
              if (siteCondition && !siteConditionErr) siteCondition.remove();
              if (oysterMeasurement && !oysterMeasurementErr) oysterMeasurement.remove();
              if (mobileTrap && !mobileTrapErr) mobileTrap.remove();
              if (settlementTiles && !settlementTilesErr) settlementTiles.remove();
              if (waterQuality && !waterQualityErr) waterQuality.remove();
              var errors = [];
              if (siteConditionErr) errors.push(siteConditionErr);
              if (oysterMeasurementErr) errors.push(oysterMeasurementErr);
              if (mobileTrapErr) errors.push(mobileTrapErr);
              if (settlementTilesErr) errors.push(settlementTilesErr);
              if (waterQualityErr) errors.push(waterQualityErr);
              return res.status(400).send({
                message: errors.join(', ')
              });
            } else {
              expedition.protocols = {};
              if (siteCondition) expedition.protocols.siteCondition = siteCondition;
              if (oysterMeasurement) expedition.protocols.oysterMeasurement = oysterMeasurement;
              if (mobileTrap) expedition.protocols.mobileTrap = mobileTrap;
              if (settlementTiles) expedition.protocols.settlementTiles = settlementTiles;
              if (waterQuality) expedition.protocols.waterQuality = waterQuality;

              expedition.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                  sendEmailToAssignedUsers(expedition, req.body.teamLists, req.user,
                    'You have been invited to join an ORS monitoring expedition',
                    'expedition_launched', {
                      TeamLead: req.user.displayName,
                      ExpeditionName: expedition.name,
                      ORSName: req.body.station.name,
                      ExpeditionDate: moment(expedition.monitoringStartDate).format('MMMM D, YYYY'),
                      ExpeditionTimeStart: moment(expedition.monitoringStartDate).format('HH:mm'),
                      ExpeditionTimeEnd: moment(expedition.monitoringEndDate).format('HH:mm'),
                      ExpeditionNotes: ((expedition.notes) ? expedition.notes : ''),
                      LinkExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id,
                      LinkProfile: httpTransport + req.headers.host + '/profiles',
                    }, function(info) {
                      res.json(expedition);
                    }, function(errorMessage) {
                      res.json(expedition);
                    });
                }
              });
            }
          });
        });
      });
    });
  });
};

/**
 * Show the current expedition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var expedition = req.expedition ? req.expedition.toJSON() : {};

  res.json(expedition);
};

/**
 * Update a expedition, assumes req.query.full was used
 */

var updateProtocols = function(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles, waterQuality,
  status, user, validate, callback) {
  var errorMessages = {};
  var allSuccessful = true;

  if (status) siteCondition.status = status;
  siteConditionHandler.updateInternal(expedition.protocols.siteCondition, siteCondition, user, validate,
  function(siteConditionErrorMessages, siteConditionSaved) {
    if (siteConditionErrorMessages) {
      errorMessages.siteCondition = siteConditionErrorMessages;
      allSuccessful = false;
    }
    if (status) oysterMeasurement.status = status;
    oysterMeasurementHandler.updateInternal(expedition.protocols.oysterMeasurement, oysterMeasurement, user, validate,
    function(oysterMeasurementSaved, oysterMeasurementErrorMessages) {
      if (oysterMeasurementErrorMessages) {
        errorMessages.oysterMeasurement = oysterMeasurementErrorMessages;
        allSuccessful = false;
      }
      if (status) mobileTrap.status = status;
      mobileTrapHandler.updateInternal(expedition.protocols.mobileTrap, mobileTrap, user, validate,
      function(mobileTrapSaved, mobileTrapErrorMessages) {
        if (mobileTrapErrorMessages) {
          errorMessages.mobileTrap = mobileTrapErrorMessages;
          allSuccessful = false;
        }
        if (status) settlementTiles.status = status;
        settlementTilesHandler.updateInternal(expedition.protocols.settlementTiles, settlementTiles, user, validate,
        function(settlementTilesSaved, settlementTilesErrorMessages) {
          if (settlementTilesErrorMessages) {
            errorMessages.settlementTiles = settlementTilesErrorMessages;
            allSuccessful = false;
          }
          if (status) waterQuality.status = status;
          waterQualityHandler.updateInternal(expedition.protocols.waterQuality, waterQuality, user, validate,
          function(waterQualitySaved, waterQualityErrorMessages) {
            if (waterQualityErrorMessages) {
              errorMessages.waterQuality = waterQualityErrorMessages;
              allSuccessful = false;
            }

            if (JSON.stringify(errorMessages) === '{}') errorMessages = null;

            callback(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved, mobileTrapSaved,
              settlementTilesSaved, waterQualitySaved);
          });
        });
      });
    });
  });
};

exports.update = function (req, res) {
  var expedition = req.expedition;

  if (expedition) {
    expedition = _.extend(expedition, req.body);
    expedition.updated = new Date();
    expedition.teamLead = req.user;

    expedition.monitoringStartDate = moment(req.body.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
    expedition.monitoringEndDate = moment(req.body.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

    expedition.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var oysterMeasurement, mobileTrap, settlementTiles, waterQuality = null;
        siteConditionHandler.updateFromExpedition(req.expedition, req.body, req.user, function(siteConditionErr, siteCondition) {
          oysterMeasurementHandler.updateFromExpedition(req.expedition, req.body, req.user, function(oysterMeasurementErr, oysterMeasurement) {
            mobileTrapHandler.updateFromExpedition(req.expedition, req.body, req.user, function(mobileTrapErr, mobileTrap) {
              settlementTilesHandler.updateFromExpedition(req.expedition, req.body, req.user, function(settlementTilesErr, settlementTiles) {
                waterQualityHandler.updateFromExpedition(req.expedition, req.body, req.user, function(waterQualityErr, waterQuality) {
                  if (req.body.sendUpdatedEmail) {
                    var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                    sendEmailToAssignedUsers(expedition, req.body.teamLists, req.user,
                      'Your expedition has been updated!',
                      'expedition_launched', {
                        TeamLead: req.user.displayName,
                        ExpeditionName: expedition.name,
                        ORSName: req.body.station.name,
                        ExpeditionDate: moment(expedition.monitoringStartDate).format('MMMM D, YYYY'),
                        ExpeditionTimeStart: moment(expedition.monitoringStartDate).format('HH:mm'),
                        ExpeditionTimeEnd: moment(expedition.monitoringEndDate).format('HH:mm'),
                        ExpeditionNotes: ((expedition.notes) ? expedition.notes : ''),
                        LinkExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id,
                        LinkProfile: httpTransport + req.headers.host + '/profiles',
                      }, function(info) {
                        res.json(expedition);
                      }, function(errorMessage) {
                        res.json(expedition);
                      });
                  } else {
                    res.json(expedition);
                  }
                });
              });
            });
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Expedition not found'
    });
  }
};

/**
 * Submit an expedition
 */
exports.submit = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  var updateActivity = function(callback) {
    var protocolsSubmitted = {};
    if (siteCondition) {
      protocolsSubmitted.siteCondition = siteCondition;
      expedition.teamLists.siteCondition = siteCondition.teamMembers;
    }
    if (oysterMeasurement) {
      protocolsSubmitted.oysterMeasurement = oysterMeasurement;
      expedition.teamLists.oysterMeasurement = oysterMeasurement.teamMembers;
    }
    if (mobileTrap) {
      protocolsSubmitted.mobileTrap = mobileTrap;
      expedition.teamLists.mobileTrap = mobileTrap.teamMembers;
    }
    if (settlementTiles) {
      protocolsSubmitted.settlementTiles = settlementTiles;
      expedition.teamLists.settlementTiles = settlementTiles.teamMembers;
    }
    if (waterQuality) {
      protocolsSubmitted.waterQuality = waterQuality;
      expedition.teamLists.waterQuality = waterQuality.teamMembers;
    }

    var status = (expedition.status === 'incomplete') ? 'submitted' : 'resubmitted';

    var activity = new ExpeditionActivity({
      status: status,
      protocols: protocolsSubmitted,
      team: expedition.team,
      expedition: expedition,
      user: req.user
    });

    activity.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        callback();
      }
    });
  };

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality, 'submitted', req.user, true,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {
      if (!siteConditionSaved) siteConditionSaved = expedition.protocols.siteCondition;
      if (!oysterMeasurementSaved) oysterMeasurementSaved = expedition.protocols.oysterMeasurement;
      if (!mobileTrapSaved) mobileTrapSaved = expedition.protocols.mobileTrap;
      if (!settlementTilesSaved) settlementTilesSaved = expedition.protocols.settlementTiles;
      if (!waterQualitySaved) waterQualitySaved = expedition.protocols.waterQuality;

      if (errorMessages) {
        return res.status(400).send({
          message: errorMessages
        });
      } else if (siteConditionSaved.status === 'submitted' &&
        oysterMeasurementSaved.status === 'submitted' &&
        mobileTrapSaved.status === 'submitted' &&
        settlementTilesSaved.status === 'submitted' &&
        waterQualitySaved.status === 'submitted') {

        expedition.status = 'pending';
        expedition.returnedNotes = '';

        expedition.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            updateActivity(function() {
              var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

              email.sendEmailTemplate(expedition.teamLead.email, 'Your team has submitted all of the protocols for the expedition ' + expedition.name,
              'expedition_completed', {
                FirstName: expedition.teamLead.firstName,
                ExpeditionName: expedition.name,
                LinkPublishExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id + '/protocols',
                LinkProfile: httpTransport + req.headers.host + '/profiles'
              },
              function(info) {
                res.json(expedition);
              }, function(errorMessage) {
                return res.status(400).send({
                  message: errorMessage
                });
              });
            });
          }
        });
      } else {
        updateActivity(function() {
          var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

          email.sendEmailTemplate(expedition.teamLead.email, 'Your team has submitted a protocol for the expedition ' + expedition.name,
          'protocol_submitted', {
            FirstName: expedition.teamLead.firstName,
            ExpeditionName: expedition.name,
            LinkViewExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id + '/protocols',
            LinkProfile: httpTransport + req.headers.host + '/profiles'
          },
          function(info) {
            res.json(expedition);
          }, function(errorMessage) {
            return res.status(400).send({
              message: errorMessage
            });
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Expedition not found'
    });
  }
};

var getTeamMemberList = function(expedition) {
  var emailArray = [];
  emailArray = emailArray.concat(_.map(expedition.teamLists.siteCondition, 'email'));
  emailArray = emailArray.concat(_.map(expedition.teamLists.oysterMeasurement, 'email'));
  emailArray = emailArray.concat(_.map(expedition.teamLists.mobileTrap, 'email'));
  emailArray = emailArray.concat(_.map(expedition.teamLists.settlementTiles, 'email'));
  emailArray = emailArray.concat(_.map(expedition.teamLists.waterQuality, 'email'));
  emailArray = _.uniq(emailArray);
  return emailArray;
};

/**
 * Publish an expedition
 */
exports.publish = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  if (siteCondition) expedition.teamLists.siteCondition = siteCondition.teamMembers;
  if (oysterMeasurement) expedition.teamLists.oysterMeasurement = oysterMeasurement.teamMembers;
  if (mobileTrap) expedition.teamLists.mobileTrap = mobileTrap.teamMembers;
  if (settlementTiles) expedition.teamLists.settlementTiles = settlementTiles.teamMembers;
  if (waterQuality) expedition.teamLists.waterQuality = waterQuality.teamMembers;

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality,'published', req.user, true,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        return res.status(400).send({
          message: errorMessages
        });
      } else {
        expedition.status = 'published';
        expedition.returnedNotes = '';
        expedition.published = new Date();

        expedition.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            var toList = getTeamMemberList(expedition);
            email.sendEmailTemplate(toList, 'Your work on the protocol(s) for expedition ' + expedition.name + ' have been published!',
            'protocols_published', {
              TeamName: expedition.team.name,
              ExpeditionName: expedition.name,
              LinkExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id,
              LinkProfile: httpTransport + req.headers.host + '/profiles'
            },
            function(info) {
              res.json(expedition);
            }, function(errorMessage) {
              return res.status(400).send({
                message: errorMessage
              });
            });
          }
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Expedition not found'
    });
  }
};

/**
 * Unpublish an expedition
 */
exports.unpublish = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality, 'submitted', req.user, false,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        return res.status(400).send({
          message: errorMessages
        });
      } else {
        expedition.status = 'pending';
        expedition.returnedNotes = '';

        expedition.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(expedition);
          }
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Expedition not found'
    });
  }
};

/**
 * Return an expedition
 */
exports.return = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  if (siteCondition) expedition.teamLists.siteCondition = siteCondition.teamMembers;
  if (oysterMeasurement) expedition.teamLists.oysterMeasurement = oysterMeasurement.teamMembers;
  if (mobileTrap) expedition.teamLists.mobileTrap = mobileTrap.teamMembers;
  if (settlementTiles) expedition.teamLists.settlementTiles = settlementTiles.teamMembers;
  if (waterQuality) expedition.teamLists.waterQuality = waterQuality.teamMembers;

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality, 'returned', req.user, false,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        return res.status(400).send({
          message: errorMessages
        });
      } else {
        expedition.status = 'returned';
        expedition.returnedNotes = req.body.returnedNotes;

        expedition.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            var toList = getTeamMemberList(expedition);
            email.sendEmailTemplate(toList, 'Your work on the protocol(s) for expedition ' + expedition.name + ' was returned',
            'protocols_returned', {
              TeamName: expedition.team.name,
              ExpeditionName: expedition.name,
              ExpeditionReturnedNote: expedition.returnedNotes,
              LinkExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id + '/protocols',
              LinkProfile: httpTransport + req.headers.host + '/profiles'
            },
            function(info) {
              res.json(expedition);
            }, function(errorMessage) {
              return res.status(400).send({
                message: errorMessage
              });
            });
          }
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Expedition not found'
    });
  }
};

/**
 * Delete a expedition
 */
exports.delete = function (req, res) {
  var expedition = req.expedition;

  if (req.query.full && (!_.isString(expedition.siteCondition) || !_.isString(expedition.oysterMeasurement) ||
      !_.isString(expedition.mobileTrap) || !_.isString(expedition.settlementTiles) || !_.isString(expedition.waterQuality))) {
    expedition.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        siteConditionHandler.deleteInternal(expedition.siteCondition, function(siteConditionErr, siteCondition) {
          oysterMeasurementHandler.deleteInternal(expedition.oysterMeasurement, function(oysterMeasurementErr, oysterMeasurement) {
            mobileTrapHandler.deleteInternal(expedition.mobileTrap, function(mobileTrapErr, mobileTrap) {
              settlementTilesHandler.deleteInternal(expedition.settlementTiles, function(settlementTilesErr, settlementTiles) {
                waterQualityHandler.deleteInternal(expedition.waterQuality, function(waterQualityErr, waterQuality) {
                  res.json(expedition);
                });
              });
            });
          });
        });
      }
    });
  } else {
    expedition.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(expedition);
      }
    });
  }
};


/**
 * List of Expeditions
 */
exports.list = function (req, res) {
  compareHelper.buildSearchQuery(req, function(error, query, queryCount) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {
      queryCount.count().exec(function(err, count) {
        if (req.query.sort) {
          if (req.query.sort === 'startDate') {
            query.sort('monitoringStartDate');
          } else if (req.query.sort === 'startDateRev') {
            query.sort('-monitoringStartDate');
          } else if (req.query.sort === 'endDate') {
            query.sort('monitoringEndDate');
          } else if (req.query.sort === 'name') {
            query.sort('name');
          } else if (req.query.sort === 'status') {
            query.sort('status');
          }
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

        query.populate('team', 'name schoolOrg teamLeads')
        .populate('teamLead', 'displayName username profileImageURL')
        .populate('station', 'name')
        .populate('teamLists.siteCondition', 'displayName username profileImageURL')
        .populate('teamLists.oysterMeasurement', 'displayName username profileImageURL')
        .populate('teamLists.mobileTrap', 'displayName username profileImageURL')
        .populate('teamLists.settlementTiles', 'displayName username profileImageURL')
        .populate('teamLists.waterQuality', 'displayName username profileImageURL')
        .populate('protocols.siteCondition', 'status')
        .populate('protocols.oysterMeasurement', 'status')
        .populate('protocols.mobileTrap', 'status')
        .populate('protocols.settlementTiles', 'status')
        .populate('protocols.waterQuality', 'status')
        .exec(function (err, expeditions) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            async.forEach(expeditions, function(item,callback) {
              SchoolOrg.populate(item.team, { 'path': 'schoolOrg' }, function(err, output) {
                if (err) throw err;

                User.populate(item.team, { 'path': 'teamLeads' }, function(err,output) {
                  if (err) throw err;
                  callback();
                });
              });
            }, function(err) {
              res.json({
                totalCount: count,
                expeditions: expeditions
              });
            });
          }
        });
      });
    }
  });
};

exports.listByORS = function (req, res) {
  Expedition.find({ 'station': req.query.stationId }).exec(function (err, expeditions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(expeditions);
    }
  });
};

exports.compare = function (req, res) {
  compareHelper.buildCompareQuery(req, function(error, expeditions) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {
      res.json(expeditions);
    }
  });
};


exports.downloadCompareCsv = function (req, res) {
  compareHelper.buildCompareQuery(req, function(error, expeditions) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {
      res.setHeader('Content-disposition', 'attachment;');
      res.setHeader('content-type', 'text/csv');

      compareHelper.createCsv(req, expeditions, function(csvArrays) {
        csv.write(csvArrays, { headers: true, quoteHeaders: true }).pipe(res);
      });
    }
  });
};

/**
 * Expedition middleware
 */
exports.expeditionByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Expedition is invalid'
    });
  }

  var query = Expedition.findById(id).populate('team').populate('teamLead', 'email displayName firstName profileImageURL')
  .populate('team.schoolOrg', 'name')
  .populate('team.teamLeads', 'email distplayName firstName profileImageURL')
  .populate('station')
  .populate('teamLists.siteCondition', 'email displayName firstName username profileImageURL')
  .populate('teamLists.oysterMeasurement', 'email displayName firstName username profileImageURL')
  .populate('teamLists.mobileTrap', 'email displayName firstName username profileImageURL')
  .populate('teamLists.settlementTiles', 'email displayName firstName username profileImageURL')
  .populate('teamLists.waterQuality', 'email displayName firstName username profileImageURL');

  if (req.query.full) {
    query.populate('protocols.siteCondition')
    .populate('protocols.oysterMeasurement')
    .populate('protocols.mobileTrap')
    .populate('protocols.settlementTiles')
    .populate('protocols.waterQuality');
  } else {
    query.populate('protocols.siteCondition', 'status scribeMember teamMembers')
    .populate('protocols.oysterMeasurement', 'status scribeMember teamMembers')
    .populate('protocols.mobileTrap', 'status scribeMember teamMembers')
    .populate('protocols.settlementTiles', 'status scribeMember teamMembers')
    .populate('protocols.waterQuality', 'status scribeMember teamMembers');
  }

  query.exec(function (err, expedition) {
    if (err) {
      return next(err);
    } else if (!expedition) {
      return res.status(404).send({
        message: 'No expedition with that identifier has been found'
      });
    }

    req.expedition = expedition;
    next();
  });
};
