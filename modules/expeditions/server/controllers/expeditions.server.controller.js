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


/**
 * List of Expeditions
 */
exports.list = function (req, res) {
  compareHelper.buildSearchQuery(req, function(error, query) {
    if (error) {
      return res.status(400).send({
        message: error
      });
    } else {

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
  .populate('station')
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
