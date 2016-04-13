'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
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
              // do settlement tiles
              waterQuality.save(function (err) {
                if (err) {
                  siteCondition.remove();
                  oysterMeasurement.remove();
                  mobileTrap.remove();
                  //settlementTile.remove();
                  return res.status(400).send({
                    message: 'Could not create a water quality protocol'
                  });
                } else {
                  expedition.protocols = {
                    siteCondition: siteCondition,
                    oysterMeasurement: oysterMeasurement,
                    mobileTrap: mobileTrap,
                    waterQuality: waterQuality
                  };
                  expedition.monitoringStartDate = moment(req.body.monitoringStartDate, 'MM/DD/YYYY HH:mm').toDate();
                  expedition.monitoringEndDate = moment(req.body.monitoringEndDate, 'MM/DD/YYYY HH:mm').toDate();

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
};

/**
 * Show the current expedition
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var expedition = req.expedition ? req.expedition.toJSON() : {};
  console.log('read', expedition);
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
    expedition.monitoringStartDate = moment(req.body.monitoringStartDate, 'MM/DD/YYYY HH:mm').toDate();
    expedition.monitoringEndDate = moment(req.body.monitoringEndDate, 'MM/DD/YYYY HH:mm').toDate();

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
 * Delete a expedition
 */
exports.delete = function (req, res) {
  var expedition = req.expedition;

  if (req.query.full && !_.isString(expedition.siteCondition) && !_.isString(expedition.oysterMeasurement) &&
      !_.isString(expedition.mobileTrap) && !_.isString(expedition.waterQuality)) {
    var siteCondition = expedition.siteCondition;
    var oysterMeasurement = expedition.oysterMeasurement;
    var mobileTrap = expedition.mobileTrap;
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

  query.exec(function (err, expeditions) {
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
  console.log('expeditionByID');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Expedition is invalid'
    });
  }

  var query = Expedition.findById(id).populate('team').populate('station');

  if (req.query.full) {
    query.populate('siteCondition').populate('oysterMeasurement').populate('mobileTrap').populate('waterQuality');
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
