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

var protocolHandlers = {
  'siteCondition': siteConditionHandler,
  'oysterMeasurement': oysterMeasurementHandler,
  'mobileTrap': mobileTrapHandler,
  'settlementTiles': settlementTilesHandler,
  'waterQuality': waterQualityHandler
};

var checkRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
};

var findUserInTeam = function(user, team) {
  var index = _.findIndex(team, function(u) {
    if (u && user) {
      var uId = (u._id) ? u._id.toString() : u.toString();
      var userId = (user._id) ? user._id.toString() : user.toString();
      return uId === userId;
    } else {
      return false;
    }
  });
  return (index > -1) ? true : false;
};

var findProtocols = function(user, teamLists, callback) {
  var protocols = [];
  if (teamLists.siteCondition && findUserInTeam(user, teamLists.siteCondition)) {
    protocols.push('Site Condition');
  }
  if (teamLists.oysterMeasurement && findUserInTeam(user, teamLists.oysterMeasurement)) {
    protocols.push('Oyster Measurements');
  }
  if (teamLists.mobileTrap && findUserInTeam(user, teamLists.mobileTrap)) {
    protocols.push('Mobile Trap');
  }
  if (teamLists.settlementTiles && findUserInTeam(user, teamLists.settlementTiles)) {
    protocols.push('Settlement Tiles');
  }
  if (teamLists.waterQuality && findUserInTeam(user, teamLists.waterQuality)) {
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
  if (teamLists.siteCondition) userArray = userArray.concat(teamLists.siteCondition);
  if (teamLists.oysterMeasurement) userArray = userArray.concat(teamLists.oysterMeasurement);
  if (teamLists.mobileTrap) userArray = userArray.concat(teamLists.mobileTrap);
  if (teamLists.settlementTiles) userArray = userArray.concat(teamLists.settlementTiles);
  if (teamLists.waterQuality) userArray = userArray.concat(teamLists.waterQuality);
  userArray = _.uniqWith(userArray, function(a, b) {
    if (a && b) {
      var aId = (a._id) ? a._id.toString() : a.toString();
      var bId = (b._id) ? b._id.toString() : b.toString();
      return aId === bId;
    } else {
      return false;
    }
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
    if (user) {
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
    } else {
      callback();
    }
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

  var startDate = expedition.monitoringStartDate;
  var latitude = req.body.station.latitude;
  var longitude = req.body.station.longitude;
  siteConditionHandler.createInternal(startDate, latitude, longitude, req.body.teamLists.siteCondition, function(siteConditionErr, siteCondition) {
    oysterMeasurementHandler.createInternal(startDate, latitude, longitude, req.body.teamLists.oysterMeasurement, function(oysterMeasurementErr, oysterMeasurement) {
      mobileTrapHandler.createInternal(startDate, latitude, longitude, req.body.teamLists.mobileTrap, function(mobileTrapErr, mobileTrap) {
        settlementTilesHandler.createInternal(startDate, latitude, longitude, req.body.teamLists.settlementTiles, function(settlementTilesErr, settlementTiles) {
          waterQualityHandler.createInternal(startDate, latitude, longitude, req.body.teamLists.waterQuality, function(waterQualityErr, waterQuality) {
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

  var updateSiteCondition = function(callback) {
    if (siteCondition) {
      if (status) siteCondition.status = status;
      siteConditionHandler.updateInternal(expedition.protocols.siteCondition, siteCondition, user, validate,
      function(siteConditionErrorMessages, siteConditionSaved) {
        if (siteConditionErrorMessages) {
          errorMessages.siteCondition = siteConditionErrorMessages;
          allSuccessful = false;
        }
        callback(siteConditionSaved);
      });
    } else {
      callback();
    }
  };

  var updateOysterMeasurement = function(callback) {
    if (oysterMeasurement) {
      if (status) oysterMeasurement.status = status;
      oysterMeasurementHandler.updateInternal(expedition.protocols.oysterMeasurement, oysterMeasurement, user, validate,
      function(oysterMeasurementErrorMessages, oysterMeasurementSaved) {
        if (oysterMeasurementErrorMessages) {
          errorMessages.oysterMeasurement = oysterMeasurementErrorMessages;
          allSuccessful = false;
        }
        callback(oysterMeasurementSaved);
      });
    } else {
      callback();
    }
  };

  var updateMobileTrap = function(callback) {
    if (mobileTrap) {
      if (status) mobileTrap.status = status;
      mobileTrapHandler.updateInternal(expedition.protocols.mobileTrap, mobileTrap, user, validate,
      function(mobileTrapErrorMessages, mobileTrapSaved) {
        if (mobileTrapErrorMessages) {
          errorMessages.mobileTrap = mobileTrapErrorMessages;
          allSuccessful = false;
        }
        callback(mobileTrapSaved);
      });
    } else {
      callback();
    }
  };

  var updateSettlementTiles = function(callback) {
    if (settlementTiles) {
      if (status) settlementTiles.status = status;
      settlementTilesHandler.updateInternal(expedition.protocols.settlementTiles, settlementTiles, user, validate,
      function(settlementTilesErrorMessages, settlementTilesSaved) {
        if (settlementTilesErrorMessages) {
          errorMessages.settlementTiles = settlementTilesErrorMessages;
          allSuccessful = false;
        }
        callback(settlementTilesSaved);
      });
    } else {
      callback();
    }
  };

  var updateWaterQuality = function(callback) {
    if (waterQuality) {
      if (status) waterQuality.status = status;
      waterQualityHandler.updateInternal(expedition.protocols.waterQuality, waterQuality, user, validate,
      function(waterQualityErrorMessages, waterQualitySaved) {
        if (waterQualityErrorMessages) {
          errorMessages.waterQuality = waterQualityErrorMessages;
          allSuccessful = false;
        }
        callback(waterQuality);
      });
    } else {
      callback();
    }
  };

  updateSiteCondition(function(siteConditionSaved) {
    updateOysterMeasurement(function(oysterMeasurementSaved) {
      updateMobileTrap(function(mobileTrapSaved) {
        updateSettlementTiles(function(settlementTilesSaved) {
          updateWaterQuality(function(waterQualitySaved) {
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

    siteConditionHandler.updateFromExpedition(req.expedition, req.body, null, function(siteConditionErr, siteCondition) {
      if (siteCondition) {
        expedition.protocols.siteCondition = siteCondition;
      } else {
        delete(expedition.protocols.siteCondition);
        delete(expedition.teamLists.siteCondition);
      }
      oysterMeasurementHandler.updateFromExpedition(req.expedition, req.body, null, function(oysterMeasurementErr, oysterMeasurement) {
        if (oysterMeasurement) {
          expedition.protocols.oysterMeasurement = oysterMeasurement;
        } else {
          delete(expedition.protocols.oysterMeasurement);
          delete(expedition.teamLists.oysterMeasurement);
        }
        mobileTrapHandler.updateFromExpedition(req.expedition, req.body, null, function(mobileTrapErr, mobileTrap) {
          if (mobileTrap) {
            expedition.protocols.mobileTrap = mobileTrap;
          } else {
            delete(expedition.protocols.mobileTrap);
            delete(expedition.teamLists.mobileTrap);
          }
          settlementTilesHandler.updateFromExpedition(req.expedition, req.body, null, function(settlementTilesErr, settlementTiles) {
            if (settlementTiles) {
              expedition.protocols.settlementTiles = settlementTiles;
            } else {
              delete(expedition.protocols.settlementTiles);
              delete(expedition.teamLists.settlementTiles);
            }
            waterQualityHandler.updateFromExpedition(req.expedition, req.body, null, function(waterQualityErr, waterQuality) {
              if (waterQuality) {
                expedition.protocols.waterQuality = waterQuality;
              } else {
                delete(expedition.protocols.waterQuality);
                delete(expedition.teamLists.waterQuality);
              }
              expedition.save(function(err) {
                if (err) {
                  console.log('expedition save', err);
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
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
                }
              });
            });
          });
        });
      });
    });
  } else {
    console.log('expedition not found');
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
        console.log('activity save error', err);
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
        console.log('update protocol errorMessages', errorMessages);
        return res.status(400).send({
          message: errorMessages
        });
      } else if ((!siteConditionSaved || siteConditionSaved.status === 'submitted') &&
        (!oysterMeasurementSaved || oysterMeasurementSaved.status === 'submitted') &&
        (!mobileTrapSaved || mobileTrapSaved.status === 'submitted') &&
        (!settlementTilesSaved || settlementTilesSaved.status === 'submitted') &&
        (!waterQualitySaved || waterQualitySaved.status === 'submitted')) {

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

var getTeamMemberList = function(expedition, callback) {
  var userArray = [];
  var emailArray = [];
  if (expedition.teamLists.siteCondition) userArray = userArray.concat(expedition.teamLists.siteCondition);
  if (expedition.teamLists.oysterMeasurement) userArray = userArray.concat(expedition.teamLists.oysterMeasurement);
  if (expedition.teamLists.mobileTrap) userArray = userArray.concat(expedition.teamLists.mobileTrap);
  if (expedition.teamLists.settlementTiles) userArray = userArray.concat(expedition.teamLists.settlementTiles);
  if (expedition.teamLists.waterQuality) userArray = userArray.concat(expedition.teamLists.waterQuality);

  userArray = _.uniqWith(userArray, function(a, b) {
    if (a && b) {
      var aId = (a._id) ? a._id.toString() : a.toString();
      var bId = (b._id) ? b._id.toString() : b.toString();
      return aId === bId;
    } else {
      return false;
    }
  });
  async.forEach(userArray, function(item, asyncCallback) {
    var userId = (item && item._id) ? item._id : item;
    User.findOne({ _id: userId }, 'email', function (err, user) {
      if (user && user.email) emailArray.push(user.email);
      asyncCallback();
    });
  }, function(err) {
    callback(emailArray);
  });
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
      waterQuality,'published', null, true,
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

            getTeamMemberList(expedition, function(toList) {
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
      waterQuality, 'submitted', null, false,
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
      waterQuality, 'returned', null, false,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurementSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        console.log('return errorMessages', errorMessages);
        return res.status(400).send({
          message: errorMessages
        });
      } else {
        expedition.status = 'returned';
        expedition.returnedNotes = req.body.returnedNotes;

        expedition.save(function(err) {
          if (err) {
            console.log('expedition save', err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

            getTeamMemberList(expedition, function(toList) {
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
                console.log('email not sent', errorMessages);
                return res.status(400).send({
                  message: errorMessage
                });
              });
            });
          }
        });
      }
    });
  } else {
    console.log('expedition not found');
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
