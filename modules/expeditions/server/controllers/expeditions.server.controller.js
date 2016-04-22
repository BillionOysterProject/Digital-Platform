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
  moment = require('moment'),
  _ = require('lodash');

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

  var updateActivity = function(callback) {
    var protocolsSubmitted = {};
    if (req.body.protocols.siteCondition) protocolsSubmitted.siteCondition = req.body.protocols.siteCondition;
    if (req.body.protocols.oysterMeasurement) protocolsSubmitted.oysterMeasurement = req.body.protocols.oysterMeasurement;
    if (req.body.protocols.mobileTrap) protocolsSubmitted.mobileTrap = req.body.protocols.mobileTrap;
    if (req.body.protocols.settlementTiles) protocolsSubmitted.settlementTiles = req.body.protocols.settlementTiles;
    if (req.body.protocols.waterQuality) protocolsSubmitted.waterQuality = req.body.protocols.waterQuality;

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
    if (expedition.protocols.siteCondition.status === 'submitted' &&
      expedition.protocols.oysterMeasurement.status === 'submitted' &&
      expedition.protocols.mobileTrap.status === 'submitted' &&
      expedition.protocols.settlementTiles.status === 'submitted' &&
      expedition.protocols.waterQuality.status === 'submitted') {

      expedition.status = 'pending';

      expedition.save(function(err) {
        if (err) {
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
                  LinkProfile: httpTransport + req.headers.host + '/settings/profile',
                  Logo: 'http://staging.bop.fearless.tech/modules/core/client/img/brand/logo.svg'
                },
                function(info) {
                  res.json(expedition);
                }, function(errorMessage) {
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
  } else {
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

  if (expedition) {

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

  if (expedition) {

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

  if (expedition) {
    var updateSiteCondition = function(callback) {
      console.log('expedition.protocols.siteCondition.status', expedition.protocols.siteCondition.status);
      if (expedition.protocols.siteCondition.status) {
        expedition.protocols.siteCondition.status = 'incomplete';
        expedition.protocols.siteCondition.save(callback());
      } else {
        callback();
      }
    };

    var updateOysterMeasurement = function(callback) {
      console.log('expedition.protocols.oysterMeasurement.status', expedition.protocols.oysterMeasurement.status);
      if (expedition.protocols.oysterMeasurement.status) {
        expedition.protocols.oysterMeasurement.status = 'incomplete';
        expedition.protocols.oysterMeasurement.save(callback());
      } else {
        callback();
      }
    };

    var updateMobileTrap = function(callback) {
      console.log('expedition.protocols.mobileTrap.status', expedition.protocols.mobileTrap.status);
      if (expedition.protocols.mobileTrap.status) {
        expedition.protocols.mobileTrap.status = 'incomplete';
        expedition.protocols.mobileTrap.save(callback());
      } else {
        callback();
      }
    };

    var updateSettlementTiles = function(callback) {
      console.log('expedition.protocols.settlementTiles.status', expedition.protocols.settlementTiles.status);
      if (expedition.protocols.settlementTiles.status) {
        expedition.protocols.settlementTiles.status = 'incomplete';
        expedition.protocols.settlementTiles.save(callback());
      } else {
        callback();
      }
    };

    var updateWaterQuality = function(callback) {
      console.log('expedition.protocols.waterQuality.status', expedition.protocols.waterQuality.status);
      if (expedition.protocols.waterQuality.status) {
        expedition.protocols.waterQuality.status = 'incomplete';
        expedition.protocols.waterQuality.save(callback());
      } else {
        callback();
      }
    };

    updateSiteCondition(function() {
      updateOysterMeasurement(function() {
        updateMobileTrap(function() {
          updateSettlementTiles(function() {
            updateWaterQuality(function() {
              console.log('setting to returned');
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
            });
          });
        });
      });
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
  .populate('station')
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
