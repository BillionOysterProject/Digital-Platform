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
  Team = mongoose.model('Team'),
  email = require(path.resolve('./modules/core/server/controllers/email.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  siteConditionHandler = require(path.resolve('./modules/protocol-site-conditions/server/controllers/protocol-site-conditions.server.controller')),
  oysterMeasurementHandler = require(path.resolve('./modules/protocol-oyster-measurements/server/controllers/protocol-oyster-measurements.server.controller')),
  mobileTrapHandler = require(path.resolve('./modules/protocol-mobile-traps/server/controllers/protocol-mobile-traps.server.controller')),
  settlementTilesHandler = require(path.resolve('./modules/protocol-settlement-tiles/server/controllers/protocol-settlement-tiles.server.controller')),
  waterQualityHandler = require(path.resolve('./modules/protocol-water-quality/server/controllers/protocol-water-quality.server.controller')),
  moment = require('moment'),
  _ = require('lodash');

var checkRole = function(user, role) {
  var index = _.findIndex(user.roles, function(r) {
    return r === role;
  });
  return (index > -1) ? true : false;
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

  var siteCondition = new ProtocolSiteCondition({
    collectionTime: expedition.monitoringStartDate,
    latitude: req.body.station.latitude,
    longitude: req.body.station.longitude,
    teamMembers: req.body.teamLists.siteCondition
  });
  var oysterMeasurement = new ProtocolOysterMeasurement({
    collectionTime: expedition.monitoringStartDate,
    latitude: req.body.station.latitude,
    longitude: req.body.station.longitude,
    teamMembers: req.body.teamLists.oysterMeasurement
  });
  var mobileTrap = new ProtocolMobileTrap({
    collectionTime: expedition.monitoringStartDate,
    latitude: req.body.station.latitude,
    longitude: req.body.station.longitude,
    teamMembers: req.body.teamLists.mobileTrap
  });
  var settlementTile = new ProtocolSettlementTile({
    collectionTime: expedition.monitoringStartDate,
    latitude: req.body.station.latitude,
    longitude: req.body.station.longitude,
    teamMembers: req.body.teamLists.settlementTiles
  });
  var waterQuality = new ProtocolWaterQuality({
    collectionTime: expedition.monitoringStartDate,
    latitude: req.body.station.latitude,
    longitude: req.body.station.longitude,
    teamMembers: req.body.teamLists.waterQuality
  });

  siteCondition.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: 'Could not create a site condition protocol'
      });
    } else {
      oysterMeasurement.save(function (err) {
        if (err) {
          siteCondition.remove();
          return res.status(400).send({
            message: 'Could not create an oyster measurement protocol'
          });
        } else {
          mobileTrap.save(function (err) {
            if (err) {
              siteCondition.remove();
              oysterMeasurement.remove();
              return res.status(400).send({
                message: 'Could not create a mobile trap protocol'
              });
            } else {
              settlementTile.save(function (err) {
                if (err) {
                  siteCondition.remove();
                  oysterMeasurement.remove();
                  mobileTrap.remove();
                  return res.status(400).send({
                    message: 'Could not create a settlement tiles protocol'
                  });
                } else {
                  waterQuality.save(function (err) {
                    if (err) {
                      siteCondition.remove();
                      oysterMeasurement.remove();
                      mobileTrap.remove();
                      settlementTile.remove();
                      return res.status(400).send({
                        message: 'Could not create a water quality protocol'
                      });
                    } else {
                      expedition.protocols = {
                        siteCondition: siteCondition,
                        oysterMeasurement: oysterMeasurement,
                        mobileTrap: mobileTrap,
                        settlementTiles: settlementTile,
                        waterQuality: waterQuality
                      };

                      expedition.save(function (err) {
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
                }
              });
            }
          });
        }
      });
    }
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
var updateSiteCondition = function(siteConditionReq, siteConditionBody, status, user, validate, callback) {
  if (siteConditionReq && siteConditionBody) {
    siteConditionReq.status = status;
    siteConditionBody.status = status;
    siteConditionHandler.updateInternal(siteConditionReq, siteConditionBody, user, validate,
      function(siteConditionSaved) {
        callback(siteConditionSaved);
      }, function(errorMessage) {
        callback(siteConditionBody, errorMessage);
      });
  } else {
    callback(siteConditionBody);
  }
};

var updateOysterMeasurement = function(oysterMeasurementReq, oysterMeasurementBody, status, user, validate, callback) {
  if (oysterMeasurementReq && oysterMeasurementBody) {
    oysterMeasurementReq.status = status;
    oysterMeasurementBody.status = status;
    oysterMeasurementHandler.updateInternal(oysterMeasurementReq, oysterMeasurementBody, user, validate,
    function(oysterMeasurementSaved) {
      callback(oysterMeasurementSaved);
    }, function(errorMessage) {
      callback(oysterMeasurementBody, errorMessage);
    });
  } else {
    callback(oysterMeasurementBody);
  }
};

var updateMobileTrap = function(mobileTrapReq, mobileTrapBody, status, user, validate, callback) {
  if (mobileTrapReq && mobileTrapBody) {
    mobileTrapReq.status = status;
    mobileTrapBody.status = status;
    mobileTrapHandler.updateInternal(mobileTrapReq, mobileTrapBody, user, validate,
    function(mobileTrapSaved) {
      callback(mobileTrapSaved);
    }, function(errorMessage) {
      callback(mobileTrapBody, errorMessage);
    });
  } else {
    callback(mobileTrapBody);
  }
};

var updateSettlementTiles = function(settlementTilesReq, settlementTilesBody, status, user, validate, callback) {
  if (settlementTilesReq && settlementTilesBody) {
    settlementTilesReq.status = status;
    settlementTilesBody.status = status;
    settlementTilesHandler.updateInternal(settlementTilesReq, settlementTilesBody, user, validate,
    function(settlementTilesSaved) {
      callback(settlementTilesSaved);
    }, function(errorMessage) {
      callback(settlementTilesBody, errorMessage);
    });
  } else {
    callback(settlementTilesBody);
  }
};

var updateWaterQuality = function(waterQualityReq, waterQualityBody, status, user, validate, callback) {
  if (waterQualityReq && waterQualityBody) {
    waterQualityReq.status = status;
    waterQualityBody.status = status;
    waterQualityHandler.updateInternal(waterQualityReq, waterQualityBody, user, validate,
    function(waterQualitySaved) {
      callback(waterQualitySaved);
    }, function(errorMessage) {
      callback(waterQualityBody, errorMessage);
    });
  } else {
    callback(waterQualityBody);
  }
};

var updateProtocols = function(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles, waterQuality,
  status, user, validate, callback) {
  var errorMessages = {};
  var allSuccessful = true;

  updateSiteCondition(expedition.protocols.siteCondition, siteCondition, status, user, validate,
  function(siteConditionSaved, siteConditionErrorMessages) {
    if (siteConditionErrorMessages) {
      errorMessages.siteCondition = siteConditionErrorMessages;
      allSuccessful = false;
    }
    updateOysterMeasurement(expedition.protocols.oysterMeasurement, oysterMeasurement, status, user, validate,
    function(oysterMeasurementSaved, oysterMeasurementErrorMessages) {
      if (oysterMeasurementErrorMessages) {
        errorMessages.oysterMeasurement = oysterMeasurementErrorMessages;
        allSuccessful = false;
      }
      updateMobileTrap(expedition.protocols.mobileTrap, mobileTrap, status, user, validate,
      function(mobileTrapSaved, mobileTrapErrorMessages) {
        if (mobileTrapErrorMessages) {
          errorMessages.mobileTrap = mobileTrapErrorMessages;
          allSuccessful = false;
        }
        updateSettlementTiles(expedition.protocols.settlementTiles, settlementTiles, status, user, validate,
        function(settlementTilesSaved, settlementTilesErrorMessages) {
          if (settlementTilesErrorMessages) {
            errorMessages.settlementTiles = settlementTilesErrorMessages;
            allSuccessful = false;
          }
          updateWaterQuality(expedition.protocols.waterQuality, waterQuality, status, user, validate,
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
        res.json(expedition);
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
    if (siteCondition) protocolsSubmitted.siteCondition = siteCondition;
    if (oysterMeasurement) protocolsSubmitted.oysterMeasurement = oysterMeasurement;
    if (mobileTrap) protocolsSubmitted.mobileTrap = mobileTrap;
    if (settlementTiles) protocolsSubmitted.settlementTiles = settlementTiles;
    if (waterQuality) protocolsSubmitted.waterQuality = waterQuality;

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
                LinkProfile: httpTransport + req.headers.host + '/settings/profile'
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
            LinkProfile: httpTransport + req.headers.host + '/settings/profile'
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
              LinkProfile: httpTransport + req.headers.host + '/settings/profile'
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
              LinkExpedition: httpTransport + req.headers.host + '/expeditions/' + expedition._id + '/protocols',
              LinkProfile: httpTransport + req.headers.host + '/settings/profile'
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

  if (req.query.full && !_.isString(expedition.siteCondition) && !_.isString(expedition.oysterMeasurement) &&
      !_.isString(expedition.mobileTrap) && !_.isString(expedition.waterQuality)) {
    var siteCondition = expedition.siteCondition;
    var oysterMeasurement = expedition.oysterMeasurement;
    var mobileTrap = expedition.mobileTrap;
    var settlementTiles = expedition.settlementTiles;
    var waterQuality = expedition.waterQuality;
    expedition.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        siteCondition.remove();
        oysterMeasurement.remove();
        mobileTrap.remove();
        settlementTiles.remove();
        waterQuality.remove();
        res.json(expedition);
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

var buildSearchQuery = function (req, callback) {
  function searchQuery (teams, siteConditionIds, oysterMeasurementIds,
    mobileTrapIds, settlementTileIds, waterQualityIds) {
    var query;
    var and = [];

    // My Expedition Search
    if (req.query.teamId) {
      and.push({ 'team': req.query.teamId });
    }
    if (req.query.byOwner) {
      and.push({ 'teamLead': req.user });
    }

    var memberOr = [];
    if (req.query.byMember) {
      memberOr.push({ 'teamLists.siteCondition': req.user });
      memberOr.push({ 'teamLists.oysterMeasurement': req.user });
      memberOr.push({ 'teamLists.mobileTrap': req.user });
      memberOr.push({ 'teamLists.settlementTiles': req.user });
      memberOr.push({ 'teamLists.waterQuality': req.user });
      and.push({ $or: memberOr });
    }

    // Published Search
    if (req.query.published) {
      and.push({ 'status': 'published' });
    }

    var searchOr = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      searchOr.push({ 'name': searchRe });
      searchOr.push({ 'notes': searchRe });

      if (siteConditionIds) {
        searchOr.push({ 'protocols.siteCondition': { '$in': siteConditionIds } });
      }
      if (oysterMeasurementIds) {
        searchOr.push({ 'protocols.oysterMeasurement': { '$in': oysterMeasurementIds } });
      }
      if (mobileTrapIds) {
        searchOr.push({ 'protocols.mobileTrap': { '$in': mobileTrapIds } });
      }
      if (settlementTileIds) {
        searchOr.push({ 'protocols.settlementTiles': { '$in': settlementTileIds } });
      }
      if (waterQualityIds) {
        searchOr.push({ 'protocols.waterQuality': { '$in': waterQualityIds } });
      }

      and.push({ $or: searchOr });
    }

    if (req.query.station) {
      and.push({ 'station' : req.query.station });
    }

    if (teams) {
      and.push({ 'team': { '$in': teams } });
    }

    if (req.query.team) {
      and.push({ 'team': req.query.team });
    }

    if (req.query.teamLead) {
      and.push({ 'teamLead': req.query.teamLead });
    }

    var startDate;
    var endDate;
    if (req.query.startDate && req.query.endDate) {
      startDate = moment(req.query.startDate).toDate();
      endDate = moment(req.query.endDate).toDate();

      if (startDate && endDate) {
        and.push({ $and: [{ 'monitoringStartDate': { '$gte': startDate } }, { 'monitoringStartDate': { '$lte': endDate } },
        { 'monitoringEndDate': { '$gte': startDate } }, { 'monitoringEndDate': { '$lte': endDate } }] });
      }
    }

    // if (checkRole('team lead pending') || checkRole('team member pending') || checkRole('partner')) {
    //   and.push({ 'status': 'published' });
    // }

    if (and.length === 1) {
      query = Expedition.find(and[0]);
    } else if (and.length > 0) {
      query = Expedition.find({ $and : and });
    } else {
      query = Expedition.find();
    }

    callback(null, query);
  }

  var findTeamIds = function(callback) {
    Team.find({ 'schoolOrg': req.query.organization }).exec(function(err, teams) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (teams && teams.length > 0) {
        var teamIds = [];
        for (var i = 0; i < teams.length; i++) {
          teamIds.push(teams[i]._id);
        }
        callback(teamIds);
      } else {
        callback([]);
      }
    });
  };

  var searchSiteConditions = function(callback) {
    var or = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      or.push({ 'notes': searchRe });
      or.push({ 'tideConditions.referencePoint': searchRe });
    }

    ProtocolSiteCondition.find({ $or: or }).exec(function(err, protocols) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (protocols && protocols.length > 0) {
        var protocolIds = [];
        for (var i = 0; i < protocols.length; i++) {
          protocolIds.push(protocols[i]._id);
        }
        callback(protocolIds);
      } else {
        callback();
      }
    });
  };

  var searchOysterMeasurement = function(callback) {
    var or = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      or.push({ 'notes': searchRe });
      or.push({ 'conditionOfOysterCage.notesOnDamageToCage': searchRe });
      or.push({ 'measuringOysterGrowth.substrateShells.notes': searchRe });
    }

    ProtocolOysterMeasurement.find({ $or: or }).exec(function(err, protocols) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (protocols && protocols.length > 0) {
        var protocolIds = [];
        for (var i = 0; i < protocols.length; i++) {
          protocolIds.push(protocols[i]._id);
        }
        callback(protocolIds);
      } else {
        callback();
      }
    });
  };

  var searchMobileOrganisms = function(callback) {
    var or = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      or.push({ 'commonName': searchRe });
      or.push({ 'latinName': searchRe });
    }

    MobileOrganism.find({ $or: or }).exec(function(err, organisms) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (organisms && organisms.length > 0) {
        var organismIds = [];
        for (var i = 0; i < organisms.length; i++) {
          organismIds.push(organisms[i]._id);
        }
        callback(organismIds);
      } else {
        callback();
      }
    });
  };

  var searchMobileTrap = function(callback) {
    searchMobileOrganisms(function(organismIds) {
      var or = [];
      var searchRe;
      if (req.query.searchString) {
        try {
          searchRe = new RegExp(req.query.searchString, 'i');
        } catch(e) {
          callback('Search string is invalid', null);
        }
        or.push({ 'notes': searchRe });
        or.push({ 'mobileOrganisms.notesQuestions': searchRe });

        if (organismIds) {
          or.push({ 'mobileOrganisms.organism': { '$in': organismIds } });
        }
      }

      ProtocolMobileTrap.find({ $or: or }).exec(function(err, protocols) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), null);
        } else if (protocols && protocols.length > 0) {
          var protocolIds = [];
          for (var i = 0; i < protocols.length; i++) {
            protocolIds.push(protocols[i]._id);
          }
          callback(protocolIds);
        } else {
          callback();
        }
      });
    });
  };

  var searchSessileOrganisms = function(callback) {
    var or = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      or.push({ 'commonName': searchRe });
      or.push({ 'latinName': searchRe });
    }

    SessileOrganism.find({ $or: or }).exec(function(err, organisms) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (organisms && organisms.length > 0) {
        var organismIds = [];
        for (var i = 0; i < organisms.length; i++) {
          organismIds.push(organisms[i]._id);
        }
        callback(organismIds);
      } else {
        callback();
      }
    });
  };

  var searchSettlementTiles = function(callback) {
    searchSessileOrganisms(function(organismIds) {
      var or = [];
      var searchRe;
      if (req.query.searchString) {
        try {
          searchRe = new RegExp(req.query.searchString, 'i');
        } catch(e) {
          callback('Search string is invalid', null);
        }
        or.push({ 'notes': searchRe });
        or.push({ 'settlementTiles.description': searchRe });
        or.push({ 'settlementTiles.grid1.notes': searchRe });
        or.push({ 'settlementTiles.grid2.notes': searchRe });
        or.push({ 'settlementTiles.grid3.notes': searchRe });
        or.push({ 'settlementTiles.grid4.notes': searchRe });
        or.push({ 'settlementTiles.grid5.notes': searchRe });
        or.push({ 'settlementTiles.grid6.notes': searchRe });
        or.push({ 'settlementTiles.grid7.notes': searchRe });
        or.push({ 'settlementTiles.grid8.notes': searchRe });
        or.push({ 'settlementTiles.grid9.notes': searchRe });
        or.push({ 'settlementTiles.grid10.notes': searchRe });
        or.push({ 'settlementTiles.grid11.notes': searchRe });
        or.push({ 'settlementTiles.grid12.notes': searchRe });
        or.push({ 'settlementTiles.grid13.notes': searchRe });
        or.push({ 'settlementTiles.grid14.notes': searchRe });
        or.push({ 'settlementTiles.grid15.notes': searchRe });
        or.push({ 'settlementTiles.grid16.notes': searchRe });
        or.push({ 'settlementTiles.grid17.notes': searchRe });
        or.push({ 'settlementTiles.grid18.notes': searchRe });
        or.push({ 'settlementTiles.grid19.notes': searchRe });
        or.push({ 'settlementTiles.grid20.notes': searchRe });
        or.push({ 'settlementTiles.grid21.notes': searchRe });
        or.push({ 'settlementTiles.grid22.notes': searchRe });
        or.push({ 'settlementTiles.grid23.notes': searchRe });
        or.push({ 'settlementTiles.grid24.notes': searchRe });
        or.push({ 'settlementTiles.grid25.notes': searchRe });

        if (organismIds) {
          or.push({ 'settlementTiles.grid1.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid2.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid3.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid4.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid5.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid6.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid7.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid8.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid9.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid10.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid11.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid12.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid13.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid14.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid15.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid16.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid17.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid18.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid19.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid20.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid21.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid22.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid23.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid24.organism': { '$in': organismIds } });
          or.push({ 'settlementTiles.grid25.organism': { '$in': organismIds } });
        }
      }

      ProtocolSettlementTile.find({ $or: or }).exec(function(err, protocols) {
        if (err) {
          callback(errorHandler.getErrorMessage(err), null);
        } else if (protocols && protocols.length > 0) {
          var protocolIds = [];
          for (var i = 0; i < protocols.length; i++) {
            protocolIds.push(protocols[i]._id);
          }
          callback(protocolIds);
        } else {
          callback();
        }
      });
    });
  };

  var searchWaterQuality = function(callback) {
    var or = [];
    var searchRe;
    if (req.query.searchString) {
      try {
        searchRe = new RegExp(req.query.searchString, 'i');
      } catch(e) {
        callback('Search string is invalid', null);
      }
      or.push({ 'notes': searchRe });
      or.push({ 'samples.others.label': searchRe });
    }

    ProtocolWaterQuality.find({ $or: or }).exec(function(err, protocols) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else if (protocols && protocols.length > 0) {
        var protocolIds = [];
        for (var i = 0; i < protocols.length; i++) {
          protocolIds.push(protocols[i]._id);
        }
        callback(protocolIds);
      } else {
        callback();
      }
    });
  };


  if (req.query.organization && !req.query.team) {
    findTeamIds(function(teamIds) {
      if (req.query.searchString) {
        searchSiteConditions(function(siteConditionIds) {
          searchOysterMeasurement(function(oysterMeasurementIds) {
            searchMobileTrap(function(mobileTrapIds) {
              searchSettlementTiles(function(settlementTileIds) {
                searchWaterQuality(function(waterQualityIds) {
                  searchQuery(teamIds, siteConditionIds, oysterMeasurementIds,
                    mobileTrapIds, settlementTileIds, waterQualityIds);
                });
              });
            });
          });
        });
      } else {
        searchQuery(teamIds);
      }
    });
  } else {
    if (req.query.searchString) {
      searchSiteConditions(function(siteConditionIds) {
        searchOysterMeasurement(function(oysterMeasurementIds) {
          searchMobileTrap(function(mobileTrapIds) {
            searchSettlementTiles(function(settlementTileIds) {
              searchWaterQuality(function(waterQualityIds) {
                searchQuery(null, siteConditionIds, oysterMeasurementIds,
                   mobileTrapIds, settlementTileIds, waterQualityIds);
              });
            });
          });
        });
      });
    } else {
      searchQuery();
    }
  }
};

/**
 * List of Expeditions
 */
exports.list = function (req, res) {
  buildSearchQuery(req, function(error, query) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {

      if (req.query.sort) {
        if (req.query.sort === 'startDate') {
          query.sort('-monitoringStartDate');
        } else if (req.query.sort === 'endDate') {
          query.sort('-monitoringEndDate');
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

      query.populate('team', 'name schoolOrg')
      .populate('team.schoolOrg', 'name')
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
          res.json(expeditions);
        }
      });
    }
  });
};

/**
 * Compare Expeditions
 */
var buildCompareQuery = function (req, callback) {
  if (req.body.expeditionIds) {


    // protocol 1: site condition
    var selectProtocol1 = [];
    if (req.body.protocol1.weatherTemperature === 'YES') {
      selectProtocol1.push('meteorologicalConditions.weatherConditions');
      selectProtocol1.push('meteorologicalConditions.airTemperatureC');
    }
    if (req.body.protocol1.windSpeedDirection === 'YES') {
      selectProtocol1.push('meteorologicalConditions.windSpeedMPH');
      selectProtocol1.push('meteorologicalConditions.windDirection');
    }
    if (req.body.protocol1.humidity === 'YES') {
      selectProtocol1.push('meteorologicalConditions.humidityPer');
    }
    if (req.body.protocol1.recentRainfall === 'YES') {
      selectProtocol1.push('recentRainfall');
    }
    if (req.body.protocol1.closestHighTideTime === 'YES') {
      selectProtocol1.push('tideConditions.closestHighTide');
    }
    if (req.body.protocol1.closestLowTideTime === 'YES') {
      selectProtocol1.push('tideConditions.closestLowTide');
    }
    if (req.body.protocol1.closestHighTideHeight === 'YES') {
      selectProtocol1.push('tideConditions.closestHighTideHeight');
    }
    if (req.body.protocol1.closestLowTideHeight === 'YES') {
      selectProtocol1.push('tideConditions.closestLowTideHeight');
    }
    if (req.body.protocol1.referencePoint === 'YES') {
      selectProtocol1.push('tideConditions.referencePoint');
    }
    if (req.body.protocol1.tidalCurrent === 'YES') {
      selectProtocol1.push('tideConditions.tidalCurrent');
    }
    if (req.body.protocol1.surfaceCurrentSpeed === 'YES') {
      selectProtocol1.push('waterConditions.surfaceCurrentSpeedMPS');
    }
    if (req.body.protocol1.waterColor === 'YES') {
      selectProtocol1.push('waterConditions.waterColor');
    }
    if (req.body.protocol1.oilSheen === 'YES') {
      selectProtocol1.push('waterConditions.oilSheen');
    }
    if (req.body.protocol1.garbageWater === 'YES') {
      selectProtocol1.push('waterConditions.garbage');
    }
    if (req.body.protocol1.pipes === 'YES') {
      selectProtocol1.push('waterConditions.markedCombinedSewerOverflowPipes');
      selectProtocol1.push('waterConditions.unmarkedPipePresent');
    }
    if (req.body.protocol1.shorelineType === 'YES') {
      selectProtocol1.push('landConditions.shoreLineType');
    }
    if (req.body.protocol1.garbageLand === 'YES') {
      selectProtocol1.push('landConditions.garbage');
    }
    if (req.body.protocol1.surfaceCover === 'YES') {
      selectProtocol1.push('landConditions.shorelineSurfaceCoverEstPer');
    }
    // protocol 2: oyster measurement
    var selectProtocol2 = [];
    if (req.body.protocol2.submergedDepth === 'YES') {
      selectProtocol2.push('depthOfOysterCage.submergedDepthofCageM');
    }
    if (req.body.protocol2.bioaccumulationOnCage === 'YES') {
      selectProtocol2.push('conditionOfOysterCage.bioaccumulationOnCage');
    }
    if (req.body.protocol2.cageDamage === 'YES') {
      selectProtocol2.push('conditionOfOysterCage.notesOnDamageToCage');
    }
    if (req.body.protocol2.setDate === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.setDate');
    }
    if (req.body.protocol2.source === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.source');
      selectProtocol2.push('measuringOysterGrowth.substrateShells.otherSource');
    }
    if (req.body.protocol2.liveOystersBaseline === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.totalNumberOfLiveOystersAtBaseline');
    }
    if (req.body.protocol2.liveOystersMonitoring === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.totalNumberOfLiveOystersOnShell');
    }
    if (req.body.protocol2.totalMass === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.totalMassOfScrubbedSubstrateShellOystersTagG');
    }
    if (req.body.protocol2.oysterMeasurements === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells.measurements');
      selectProtocol2.push('measuringOysterGrowth.substrateShells.minimumSizeOfLiveOysters');
      selectProtocol2.push('measuringOysterGrowth.substrateShells.maximumSizeOfLiveOysters');
      selectProtocol2.push('measuringOysterGrowth.substrateShells.averageSizeOfLiveOysters');
      selectProtocol2.push('minimumSizeOfAllLiveOysters');
      selectProtocol2.push('maximumSizeOfAllLiveOysters');
      selectProtocol2.push('averageSizeOfAllLiveOysters');
      selectProtocol2.push('totalNumberOfAllLiveOysters');
    }
    // protocol 3: mobile trap
    var selectProtocol3 = [];
    if (req.body.protocol3.organism === 'YES') {
      selectProtocol3.push('mobileOrganisms.organism');
      selectProtocol3.push('mobileOrganisms.count');
    }
    // protocol 4: settlement tiles
    var selectProtocol4 = [];
    if (req.body.protocol4.description === 'YES') {
      selectProtocol4.push('settlementTiles.description');
    }
    if (req.body.protocol4.organism === 'YES') {
      selectProtocol4.push('settlementTiles.grid1.organism');
      selectProtocol4.push('settlementTiles.grid1.notes');
      selectProtocol4.push('settlementTiles.grid2.organism');
      selectProtocol4.push('settlementTiles.grid2.notes');
      selectProtocol4.push('settlementTiles.grid3.organism');
      selectProtocol4.push('settlementTiles.grid3.notes');
      selectProtocol4.push('settlementTiles.grid4.organism');
      selectProtocol4.push('settlementTiles.grid4.notes');
      selectProtocol4.push('settlementTiles.grid5.organism');
      selectProtocol4.push('settlementTiles.grid5.notes');
      selectProtocol4.push('settlementTiles.grid6.organism');
      selectProtocol4.push('settlementTiles.grid6.notes');
      selectProtocol4.push('settlementTiles.grid7.organism');
      selectProtocol4.push('settlementTiles.grid7.notes');
      selectProtocol4.push('settlementTiles.grid8.organism');
      selectProtocol4.push('settlementTiles.grid8.notes');
      selectProtocol4.push('settlementTiles.grid9.organism');
      selectProtocol4.push('settlementTiles.grid9.notes');
      selectProtocol4.push('settlementTiles.grid10.organism');
      selectProtocol4.push('settlementTiles.grid10.notes');
      selectProtocol4.push('settlementTiles.grid11.organism');
      selectProtocol4.push('settlementTiles.grid11.notes');
      selectProtocol4.push('settlementTiles.grid12.organism');
      selectProtocol4.push('settlementTiles.grid12.notes');
      selectProtocol4.push('settlementTiles.grid13.organism');
      selectProtocol4.push('settlementTiles.grid13.notes');
      selectProtocol4.push('settlementTiles.grid14.organism');
      selectProtocol4.push('settlementTiles.grid14.notes');
      selectProtocol4.push('settlementTiles.grid15.organism');
      selectProtocol4.push('settlementTiles.grid15.notes');
      selectProtocol4.push('settlementTiles.grid16.organism');
      selectProtocol4.push('settlementTiles.grid16.notes');
      selectProtocol4.push('settlementTiles.grid17.organism');
      selectProtocol4.push('settlementTiles.grid17.notes');
      selectProtocol4.push('settlementTiles.grid18.organism');
      selectProtocol4.push('settlementTiles.grid18.notes');
      selectProtocol4.push('settlementTiles.grid19.organism');
      selectProtocol4.push('settlementTiles.grid19.notes');
      selectProtocol4.push('settlementTiles.grid20.organism');
      selectProtocol4.push('settlementTiles.grid20.notes');
      selectProtocol4.push('settlementTiles.grid21.organism');
      selectProtocol4.push('settlementTiles.grid21.notes');
      selectProtocol4.push('settlementTiles.grid22.organism');
      selectProtocol4.push('settlementTiles.grid22.notes');
      selectProtocol4.push('settlementTiles.grid23.organism');
      selectProtocol4.push('settlementTiles.grid23.notes');
      selectProtocol4.push('settlementTiles.grid24.organism');
      selectProtocol4.push('settlementTiles.grid24.notes');
      selectProtocol4.push('settlementTiles.grid25.organism');
      selectProtocol4.push('settlementTiles.grid25.notes');
    }
    // protocol 5: water quality
    var selectProtocol5 = [];
    if (req.body.protocol5.depth === 'YES') {
      selectProtocol5.push('samples.depthOfWaterSampleM');
      selectProtocol5.push('samples.locationOfWaterSample');
    }
    if (req.body.protocol5.temperature === 'YES') {
      selectProtocol5.push('samples.waterTemperature');
    }
    if (req.body.protocol5.dissolvedOxygen === 'YES') {
      selectProtocol5.push('samples.dissolvedOxygen');
    }
    if (req.body.protocol5.salinity === 'YES') {
      selectProtocol5.push('samples.salinity');
    }
    if (req.body.protocol5.pH === 'YES') {
      selectProtocol5.push('samples.pH');
    }
    if (req.body.protocol5.turbidity === 'YES') {
      selectProtocol5.push('samples.turbidity');
    }
    if (req.body.protocol5.ammonia === 'YES') {
      selectProtocol5.push('samples.ammonia');
    }
    if (req.body.protocol5.nitrates === 'YES') {
      selectProtocol5.push('samples.nitrates');
    }
    if (req.body.protocol5.other === 'YES') {
      selectProtocol5.push('samples.others');
    }

    var select = {
      name: 1,
      station: 1,
      monitoringStartDate: 1
    };
    if (selectProtocol1.length > 0) select['protocols.siteCondition'] = 1;
    if (selectProtocol2.length > 0) select['protocols.oysterMeasurement'] = 1;
    if (selectProtocol3.length > 0) select['protocols.mobileTrap'] = 1;
    if (selectProtocol4.length > 0) select['protocols.settlementTiles'] = 1;
    if (selectProtocol5.length > 0) select['protocols.waterQuality'] = 1;

    var query = Expedition.find({ '_id' : { $in : req.body.expeditionIds } }, select).sort('-monitoringStartDate');

    query.populate('station', 'name');

    if (selectProtocol1.length > 0) query.populate('protocols.siteCondition', selectProtocol1.join(' '));
    if (selectProtocol2.length > 0) query.populate('protocols.oysterMeasurement', selectProtocol2.join(' '));
    if (selectProtocol3.length > 0) query.populate('protocols.mobileTrap', selectProtocol3.join(' '));
    if (selectProtocol4.length > 0) query.populate('protocols.settlementTiles', selectProtocol4.join(' '));
    if (selectProtocol5.length > 0) query.populate('protocols.waterQuality', selectProtocol5.join(' '));

    query.exec(function (err, expeditions) {
      if (err) {
        callback(errorHandler.getErrorMessage(err), null);
      } else {
        callback(null, expeditions);
      }
    });
  } else {
    callback('Must have list of expeditions', null);
  }
};

exports.compare = function (req, res) {
  buildCompareQuery(req, function(error, expeditions) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {
      res.json(expeditions);
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
  .populate('station', 'name latitude longitude')
  .populate('teamLists.siteCondition', 'email displayName username profileImageURL')
  .populate('teamLists.oysterMeasurement', 'email displayName username profileImageURL')
  .populate('teamLists.mobileTrap', 'email displayName username profileImageURL')
  .populate('teamLists.settlementTiles', 'email displayName username profileImageURL')
  .populate('teamLists.waterQuality', 'email displayName username profileImageURL');

  if (req.query.full) {
    query.populate('protocols.siteCondition')
    .populate('protocols.oysterMeasurement')
    .populate('protocols.mobileTrap')
    .populate('protocols.settlementTiles')
    .populate('protocols.waterQuality');
  } else {
    query.populate('protocols.siteCondition', 'status')
    .populate('protocols.oysterMeasurement', 'status')
    .populate('protocols.mobileTrap', 'status')
    .populate('protocols.settlementTiles', 'status')
    .populate('protocols.waterQuality', 'status');
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
