'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  Expedition = mongoose.model('Expedition'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  ExpeditionActivity = mongoose.model('ExpeditionActivity'),
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

  var siteCondition = new ProtocolSiteCondition({});
  var oysterMeasurement = new ProtocolOysterMeasurement({});
  var mobileTrap = new ProtocolMobileTrap({});
  var settlementTile = new ProtocolSettlementTile({});
  var waterQuality = new ProtocolWaterQuality({});

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
                      expedition.teamLead = req.user;
                      expedition.protocols = {
                        siteCondition: siteCondition,
                        oysterMeasurement: oysterMeasurement,
                        mobileTrap: mobileTrap,
                        settlementTiles: settlementTile,
                        waterQuality: waterQuality
                      };
                      expedition.monitoringStartDate = moment(req.body.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
                      expedition.monitoringEndDate = moment(req.body.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

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
var updateSiteCondition = function(siteConditionReq, siteConditionBody, status, user, callback) {
  console.log('siteConditionReq', siteConditionReq);
  console.log('siteConditionBody', siteConditionBody);
  if (siteConditionBody) {
    siteConditionBody.status = status;
    siteConditionHandler.updateInternal(siteConditionReq, siteConditionBody, user,
      function(siteConditionSaved) {
        callback(siteConditionSaved);
      }, function(errorMessage) {
        callback(siteConditionBody, errorMessage);
      });
  } else {
    callback(siteConditionBody);
  }
};

var updateOysterMeasurement = function(oysterMeasurmentReq, oysterMeasurementBody, status, user, callback) {
  if (oysterMeasurementBody) {
    oysterMeasurementBody.status = status;
    oysterMeasurementHandler.updateInternal(oysterMeasurmentReq, oysterMeasurementBody, user,
    function(oysterMeasurementSaved) {
      callback(oysterMeasurementSaved);
    }, function(errorMessage) {
      callback(oysterMeasurementBody, errorMessage);
    });
  } else {
    callback(oysterMeasurementBody);
  }
};

var updateMobileTrap = function(mobileTrapReq, mobileTrapBody, status, user, callback) {
  if (mobileTrapBody) {
    mobileTrapBody.status = status;
    mobileTrapHandler.updateInternal(mobileTrapReq, mobileTrapBody, user,
    function(mobileTrapSaved) {
      callback(mobileTrapSaved);
    }, function(errorMessage) {
      callback(mobileTrapBody, errorMessage);
    });
  } else {
    callback(mobileTrapBody);
  }
};

var updateSettlementTiles = function(settlementTilesReq, settlementTilesBody, status, user, callback) {
  if (settlementTilesBody) {
    settlementTilesBody.status = status;
    settlementTilesHandler.updateInternal(settlementTilesReq, settlementTilesBody, user,
    function(settlementTilesSaved) {
      callback(settlementTilesSaved);
    }, function(errorMessage) {
      callback(settlementTilesBody, errorMessage);
    });
  } else {
    callback(settlementTilesBody);
  }
};

var updateWaterQuality = function(waterQualityReq, waterQualityBody, status, user, callback) {
  if (waterQualityBody) {
    waterQualityBody.status = status;
    waterQualityHandler.updateInternal(waterQualityReq, waterQualityBody, user,
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
  status, user, callback) {
  var errorMessages = {};
  var allSuccessful = true;
  console.log('update protocols');
  updateSiteCondition(expedition.protocols.siteCondition, siteCondition, status, user,
  function(siteConditionSaved, siteConditionErrorMessages) {
    if (siteConditionErrorMessages) {
      console.log('siteConditionErrorMessages', siteConditionErrorMessages);
      errorMessages.siteCondition = siteConditionErrorMessages;
      allSuccessful = false;
    }
    updateOysterMeasurement(expedition.protocols.oysterMeasurement, oysterMeasurement, status, user,
    function(oysterMeasurmentSaved, oysterMeasurmentErrorMessages) {
      if (oysterMeasurmentErrorMessages) {
        console.log('oysterMeasurmentErrorMessages', oysterMeasurmentErrorMessages);
        errorMessages.oysterMeasurement = oysterMeasurmentErrorMessages;
        allSuccessful = false;
      }
      updateMobileTrap(expedition.protocols.mobileTrap, mobileTrap, status, user,
      function(mobileTrapSaved, mobileTrapErrorMessages) {
        if (mobileTrapErrorMessages) {
          console.log('mobileTrapErrorMessages', mobileTrapErrorMessages);
          errorMessages.mobileTrap = mobileTrapErrorMessages;
          allSuccessful = false;
        }
        updateSettlementTiles(expedition.protocols.settlementTiles, settlementTiles, status, user,
        function(settlementTilesSaved, settlementTilesErrorMessages) {
          if (settlementTilesErrorMessages) {
            console.log('settlementTilesErrorMessages', settlementTilesErrorMessages);
            errorMessages.settlementTiles = settlementTilesErrorMessages;
            allSuccessful = false;
          }
          updateWaterQuality(expedition.protocols.waterQuality, waterQuality, status, user,
          function(waterQualitySaved, waterQualityErrorMessages) {
            if (waterQualityErrorMessages) {
              console.log('waterQualityErrorMessages', waterQualityErrorMessages);
              errorMessages.waterQuality = waterQualityErrorMessages;
              allSuccessful = false;
            }

            console.log('protocols errorMessages', errorMessages);
            console.log('protocols errorMessages === {}', JSON.stringify(errorMessages) === '{}');
            if (JSON.stringify(errorMessages) === '{}') errorMessages = null;
            console.log('updated protocols errorMessages', errorMessages);
            callback(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurmentSaved, mobileTrapSaved,
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

  console.log('siteCondition', siteCondition);

  var errorMessages = {};

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
      waterQuality, 'submitted', req.user,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurmentSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        console.log('error saving protocols', errorMessages);
        return res.status(400).send({
          message: errorMessages
        });
      } else if (siteConditionSaved.status === 'submitted' &&
        oysterMeasurmentSaved.status === 'submitted' &&
        mobileTrapSaved.status === 'submitted' &&
        settlementTilesSaved.status === 'submitted' &&
        waterQualitySaved.status === 'submitted') {

        expedition.status = 'pending';

        expedition.save(function(err) {
          if (err) {
            console.log('expedition save err', err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            updateActivity(function() {
              Team.findById(expedition.team).populate('teamLead', 'email displayName profileImageURL').
              exec(function(err, team) {
                if (team) {
                  var httpTransport = (config.secure && config.secure.ssl === true) ? 'https://' : 'http://';

                  email.sendEmailTemplate(team.teamLead.email, 'Your team has submitted all of the protocols for the expedition ' + expedition.name,
                  'expedition_completed', {
                    FirstName: team.teamLead.firstName,
                    ExpeditionName: expedition.name,
                    LinkPublishExpedition: httpTransport + req.headers.host + 'expeditions/' + expedition._id + '/protocols',
                    LinkProfile: httpTransport + req.headers.host + '/settings/profile'
                  },
                  function(info) {
                    res.json(expedition);
                  }, function(errorMessage) {
                    console.log('email error', errorMessage);
                    return res.status(400).send({
                      message: errorMessage
                    });
                  });
                } else {
                  res.json(expedition);
                }
              });
            });
          }
        });
      } else {
        updateActivity(function() {
          res.json(expedition);
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
 * Publish an expedition
 */
exports.publish = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  var errorMessages = {};

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality,'published', req.user,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurmentSaved,
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
 * Unpublish an expedition
 */
exports.unpublish = function (req, res) {
  var expedition = req.expedition;
  var siteCondition = req.body.protocols.siteCondition;
  var oysterMeasurement = req.body.protocols.oysterMeasurement;
  var mobileTrap = req.body.protocols.mobileTrap;
  var settlementTiles = req.body.protocols.settlementTiles;
  var waterQuality = req.body.protocols.waterQuality;

  var errorMessages = {};

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality, 'unpublished', req.user,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurmentSaved,
      mobileTrapSaved, settlementTilesSaved, waterQualitySaved) {

      if (errorMessages) {
        return res.status(400).send({
          message: errorMessages
        });
      } else {
        expedition.status = 'unpublished';

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

  var errorMessages = {};

  if (expedition) {
    updateProtocols(expedition, siteCondition, oysterMeasurement, mobileTrap, settlementTiles,
      waterQuality, 'returned', req.user,
    function(allSuccessful, errorMessages, siteConditionSaved, oysterMeasurmentSaved,
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
  var query;
  var and = [];

  if (req.query.teamId) {
    and.push({ 'team': req.query.teamId });
  }
  if (req.query.byOwner) {
    and.push({ 'teamLead': req.user });
  }
  if (req.query.byMember) {
    var or = [];
    or.push({ 'teamLists.siteCondition': req.user });
    or.push({ 'teamLists.oysterMeasurement': req.user });
    or.push({ 'teamLists.mobileTrap': req.user });
    or.push({ 'teamLists.settlementTiles': req.user });
    or.push({ 'teamLists.waterQuality': req.user });
    and.push({ $or: or });
  }

  if (checkRole('team lead pending') || checkRole('team member pending') || checkRole('partner')) {
    console.log('only getting published');
    and.push({ 'status': 'published' });
  }

  if (and.length === 1) {
    query = Expedition.find(and[0]);
  } else if (and.length > 0) {
    query = Expedition.find({ $and : and });
  } else {
    query = Expedition.find();
  }

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
    if (req.query.page) {
      query.skip(req.query.limit*(req.query.page-1)).limit(req.query.limit);
    }
  } else {
    query.limit(req.query.limit);
  }

  query.populate('team', 'name')
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

  var query = Expedition.findById(id).populate('team').populate('team.teamLead', 'email displayName profileImageURL')
  .populate('team.schoolOrg', 'name')
  .populate('station', 'name latitude longitude')
  .populate('teamLists.siteCondition', 'displayName username profileImageURL')
  .populate('teamLists.oysterMeasurement', 'displayName username profileImageURL')
  .populate('teamLists.mobileTrap', 'displayName username profileImageURL')
  .populate('teamLists.settlementTiles', 'displayName username profileImageURL')
  .populate('teamLists.waterQuality', 'displayName username profileImageURL');

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
