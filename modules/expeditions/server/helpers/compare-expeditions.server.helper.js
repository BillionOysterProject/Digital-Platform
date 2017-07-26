'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Expedition = mongoose.model('Expedition'),
  ProtocolSiteCondition = mongoose.model('ProtocolSiteCondition'),
  ProtocolOysterMeasurement = mongoose.model('ProtocolOysterMeasurement'),
  ProtocolMobileTrap = mongoose.model('ProtocolMobileTrap'),
  ProtocolSettlementTile = mongoose.model('ProtocolSettlementTile'),
  ProtocolWaterQuality = mongoose.model('ProtocolWaterQuality'),
  MobileOrganism = mongoose.model('MobileOrganism'),
  SessileOrganism = mongoose.model('SessileOrganism'),
  Team = mongoose.model('Team'),
  WeatherCondition = mongoose.model('MetaWeatherCondition'),
  WindDirection = mongoose.model('MetaWindDirection'),
  WaterColor = mongoose.model('MetaWaterColor'),
  GarbageExtent = mongoose.model('MetaGarbageExtent'),
  WaterFlow = mongoose.model('MetaWaterFlow'),
  ShorelineType = mongoose.model('MetaShorelineType'),
  Bioaccumulation = mongoose.model('MetaBioaccumulation'),
  WaterTemperatureMethod = mongoose.model('MetaWaterTemperatureMethod'),
  WaterTemperatureUnit = mongoose.model('MetaWaterTemperatureUnit'),
  DissolvedOxygenMethod = mongoose.model('MetaDissolvedOxygenMethod'),
  DissolvedOxygenUnit = mongoose.model('MetaDissolvedOxygenUnit'),
  SalinityMethod = mongoose.model('MetaSalinityMethod'),
  SalinityUnit = mongoose.model('MetaSalinityUnit'),
  PhMethod = mongoose.model('MetaPhMethod'),
  PhUnit = mongoose.model('MetaPhUnit'),
  TurbidityMethod = mongoose.model('MetaTurbidityMethod'),
  TurbidityUnit = mongoose.model('MetaTurbidityUnit'),
  AmmoniaMethod = mongoose.model('MetaAmmoniaMethod'),
  AmmoniaUnit = mongoose.model('MetaAmmoniaUnit'),
  NitrateMethod = mongoose.model('MetaNitrateMethod'),
  NitrateUnit = mongoose.model('MetaNitrateUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  csv = require('fast-csv'),
  fs = require('fs'),
  async = require('async'),
  _ = require('lodash');

var buildSearchQuery = function (req, callback) {
  function searchQuery (teams, siteConditionIds, oysterMeasurementIds,
    mobileTrapIds, settlementTileIds, waterQualityIds) {
    var user = (req.query.userId ? req.query.userId : req.user);
    var query;
    var queryCount;
    var and = [];

    // My Expedition Search
    if (req.query.teamId) {
      and.push({ 'team': req.query.teamId });
    }
    if (req.query.byOwner) {
      and.push({ 'teamLead': user });
    }

    var memberOr = [];
    if (req.query.byMember) {
      memberOr.push({ 'teamLists.siteCondition': user });
      memberOr.push({ 'teamLists.oysterMeasurement': user });
      memberOr.push({ 'teamLists.mobileTrap': user });
      memberOr.push({ 'teamLists.settlementTiles': user });
      memberOr.push({ 'teamLists.waterQuality': user });
      and.push({ $or: memberOr });
    }

    // Published Search
    if (req.query.published === 'true') {
      and.push({ 'status': 'published' });
    } else if (req.query.published === 'false') {
      and.push({ 'status': { '$ne': 'published' } });
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
      queryCount = Expedition.find(and[0]);
    } else if (and.length > 0) {
      query = Expedition.find({ $and : and });
      queryCount = Expedition.find({ $and : and });
    } else {
      query = Expedition.find();
      queryCount = Expedition.find();
    }

    callback(null, query, queryCount);
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
        for (var i = 1; i < 26; i++) {
          var searchNotes = {};
          searchNotes['settlementTiles.grid'+i+'.notes'] = searchRe;
          or.push(searchNotes);
        }

        if (organismIds) {
          for (var j = 1; j < 26; j++) {
            var searchOrganism = {};
            searchOrganism['settlementTiles.grid'+j+'.organism'] = {};
            searchOrganism['settlementTiles.grid'+j+'.organism'].$in = organismIds;
            or.push(searchOrganism);
          }
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
    if (req.body.protocol1.tide === 'YES') {
      selectProtocol1.push('tideConditions.closestHighTide');
      selectProtocol1.push('tideConditions.closestLowTide');
      selectProtocol1.push('tideConditions.closestHighTideHeight');
      selectProtocol1.push('tideConditions.closestLowTideHeight');
    }
    if (req.body.protocol1.referencePoint === 'YES') {
      selectProtocol1.push('tideConditions.referencePoint');
    }
    if (req.body.protocol1.tidalCurrent === 'YES') {
      selectProtocol1.push('tideConditions.tidalCurrent');
    }
    if (req.body.protocol1.waterConditionPhoto === 'YES') {
      selectProtocol1.push('waterConditions.waterConditionPhoto');
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
      selectProtocol1.push('waterConditions.unmarkedOutfallPipes');
    }
    if (req.body.protocol1.landConditionPhoto === 'YES') {
      selectProtocol1.push('landConditions.landConditionPhoto');
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
    if (req.body.protocol2.oysterCagePhoto === 'YES') {
      selectProtocol2.push('conditionOfOysterCage.oysterCagePhoto');
    }
    if (req.body.protocol2.bioaccumulationOnCage === 'YES') {
      selectProtocol2.push('conditionOfOysterCage.bioaccumulationOnCage');
    }
    if (req.body.protocol2.cageDamage === 'YES') {
      selectProtocol2.push('conditionOfOysterCage.notesOnDamageToCage');
    }
    if (req.body.protocol2.oysterMeasurements === 'YES') {
      selectProtocol2.push('measuringOysterGrowth.substrateShells');
      selectProtocol2.push('totalNumberOfAllLiveOysters');
      selectProtocol2.push('averageSizeOfAllLiveOysters');
      selectProtocol2.push('minimumSizeOfAllLiveOysters');
      selectProtocol2.push('maximumSizeOfAllLiveOysters');
    }

    // protocol 3: mobile trap
    var selectProtocol3 = [];
    if (req.body.protocol3.organism === 'YES') {
      selectProtocol3.push('mobileOrganisms.organism');
      selectProtocol3.push('mobileOrganisms.count');
      selectProtocol3.push('mobileOrganisms.sketchPhoto');
    }
    // protocol 4: settlement tiles
    var selectProtocol4 = [];
    if (req.body.protocol4.description === 'YES') {
      selectProtocol4.push('settlementTiles.tilePhoto');
      selectProtocol4.push('settlementTiles.description');
    }
    if (req.body.protocol4.organism === 'YES') {
      for (var m = 1; m < 26; m++) {
        selectProtocol4.push('settlementTiles.grid'+m+'.organism');
        selectProtocol4.push('settlementTiles.grid'+m+'.notes');
      }
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

    var query = Expedition.find({ '_id' : { $in : req.body.expeditionIds } }, select).sort('monitoringStartDate');

    if (req.body.protocol2.oysterMeasurements === 'YES') {
      query.populate('station', 'name baselines');
    } else {
      query.populate('station', 'name');
    }

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

var getExpeditionDate = function(date) {
  return moment(date).format('MMMM D, YYYY');
};

var getShortDate = function(date) {
  if (date) {
    return moment(date).format('M/D/YY');
  } else {
    return '';
  }
};

var getTime = function(date) {
  return moment(date).format('h:mma');
};

var getDateTime = function(date) {
  return moment(date).format('MMM D, YYYY, h:mma');
};

var getExtentCode = function(value, callback) {
  GarbageExtent.findOne({ value: value }).exec(function(err, extent) {
    if (err) {
      callback(err, null);
    } else if (extent) {
      callback(null, extent.order);
    } else {
      callback(null, '');
    }
  });
};

var addGarbageExtent = function(rows, garbage, type, callback) {
  if (garbage) {
    async.parallel([
      // Add Garbage
      function (done) {
        rows['garbage'+type].push((garbage.garbagePresent) ? 1 : 0);
        done(garbage.garbagePresent, null);
      },
      // Add Hard Plastic
      function (done) {
        if (garbage.hardPlastic) {
          getExtentCode(garbage.hardPlastic, function(err, code) {
            if (err) done(err);
            rows['hardPlastic'+type].push(code);
            done(null);
          });
        } else {
          rows['hardPlastic'+type].push('');
          done(null);
        }
      },
      // Add Soft Plastic
      function (done) {
        if (garbage.softPlastic) {
          getExtentCode(garbage.softPlastic, function(err, code) {
            if (err) done(err);
            rows['softPlastic'+type].push(code);
            done(null);
          });
        } else {
          rows['softPlastic'+type].push('');
          done(null);
        }
      },
      // Add Metal
      function (done) {
        if (garbage.metal) {
          getExtentCode(garbage.metal, function(err, code) {
            if (err) done(err);
            rows['metal'+type].push(code);
            done(null);
          });
        } else {
          rows['metal'+type].push('');
          done(null);
        }
      },
      // Add Paper
      function (done) {
        if (garbage.paper) {
          getExtentCode(garbage.paper, function(err, code) {
            if (err) done(err);
            rows['paper'+type].push(code);
            done(null);
          });
        } else {
          rows['paper'+type].push('');
          done(null);
        }
      },
      // Add Glass
      function (done) {
        if (garbage.glass) {
          getExtentCode(garbage.glass, function(err, code) {
            if (err) done(err);
            rows['glass'+type].push(code);
            done(null);
          });
        } else {
          rows['glass'+type].push('');
          done(null);
        }
      },
      // Add Organic
      function (done) {
        if (garbage.organic) {
          getExtentCode(garbage.organic, function(err, code) {
            if (err) done(err);
            rows['organic'+type].push(code);
            done(null);
          });
        } else {
          rows['organic'+type].push('');
          done(null);
        }
      },
      // Add Other
      function (done) {
        if (garbage.other && garbage.other.description && garbage.other.extent) {
          getExtentCode(garbage.other.extent, function(err, code) {
            rows['other'+type].push(garbage.other.description+' - '+code);
            done(null);
          });
        } else {
          rows['other'+type].push('');
          done(null);
        }
      },
    ], function(err) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  } else {
    rows['garbage'+type].push('');
    rows['hardPlastic'+type].push('');
    rows['softPlastic'+type].push('');
    rows['metal'+type].push('');
    rows['paper'+type].push('');
    rows['glass'+type].push('');
    rows['organic'+type].push('');
    rows['other'+type].push('');
    callback();
  }
};

var getMobileOrganismNameAndImage = function(id, callback) {
  MobileOrganism.findById(id).exec(function(err, organism) {
    if (err) {
      callback(err, null, null);
    } else if (organism) {
      var photoPath = (organism && organism.image) ? organism.image.path : '';
      callback(null, organism.commonName, photoPath);
    } else {
      callback(null, '', '');
    }
  });
};

var getSessileOrganismNameAndImage = function(id, callback) {
  SessileOrganism.findById(id).exec(function(err, organism) {
    if (err) {
      callback(err, null, null);
    } else if (organism) {
      var photoPath = (organism && organism.image) ? organism.image.path : '';
      callback(null, organism.commonName, photoPath);
    } else {
      callback(null, '', '');
    }
  });
};

var addExpeditionToColumn = function(expedition, headers, rows, req, maxSamples, callback) {
  async.parallel([
    // Add header
    function (done) {
      if (expedition && expedition.name && expedition.station && expedition.station.name && expedition.monitoringStartDate) {
        headers.push(expedition.name+'\r\n'+expedition.station.name+',\r\n'+
          getExpeditionDate(expedition.monitoringStartDate));
      } else if (expedition && expedition.name && expedition.monitoringStartDate) {
        headers.push(expedition.name+'\r\n\r\n'+
          getExpeditionDate(expedition.monitoringStartDate));
      } else if (expedition && expedition.name) {
        headers.push(expedition.name+'\r\n\r\n');
      } else {
        headers.push('');
      }
      done(null);
    },
    // Add Weather/Temperature
    function (done) {
      if (req.body.protocol1.weatherTemperature === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.meteorologicalConditions) {
          rows.airTemperatureC.push(expedition.protocols.siteCondition.meteorologicalConditions.airTemperatureC);
          if (expedition.protocols.siteCondition.meteorologicalConditions.weatherConditions) {
            WeatherCondition.findOne({ value: expedition.protocols.siteCondition.meteorologicalConditions.weatherConditions })
            .exec(function(err, obj) {
              if (err) {
                done(err);
              } else {
                rows.weatherConditions.push((obj) ? obj.order : '');
                done(null);
              }
            });
          } else {
            rows.weatherConditions.push('');
            done(null);
          }
        } else {
          rows.airTemperatureC.push('');
          rows.weatherConditions.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Wind Speed/Direction
    function (done) {
      if (req.body.protocol1.windSpeedDirection === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.meteorologicalConditions) {
          rows.windSpeedMPH.push(expedition.protocols.siteCondition.meteorologicalConditions.windSpeedMPH);
          if (expedition.protocols.siteCondition.meteorologicalConditions.windDirection) {
            WindDirection.findOne({ value: expedition.protocols.siteCondition.meteorologicalConditions.windDirection })
            .exec(function(err, dir) {
              if (err) {
                done(err);
              } else {
                rows.windDirection.push((dir) ? dir.abbreviation : '');
                done(null);
              }
            });
          } else {
            rows.windDirection.push('');
            done(null);
          }
        } else {
          rows.windSpeedMPH.push('');
          rows.windDirection.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Recent Rainfail
    function (done) {
      if (req.body.protocol1.recentRainfall === 'YES') {
        rows.recentRainfallHeader.push('');
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.recentRainfall) {
          rows.rainfall24hrs.push((expedition.protocols.siteCondition.recentRainfall.rainedIn24Hours) ? 1 : 0);
          rows.rainfall72hrs.push((expedition.protocols.siteCondition.recentRainfall.rainedIn72Hours) ? 1 : 0);
          rows.rainfall7days.push((expedition.protocols.siteCondition.recentRainfall.rainedIn7Days) ? 1 : 0);
        } else {
          rows.rainfall24hrs.push('');
          rows.rainfall72hrs.push('');
          rows.rainfall7days.push('');
        }
      }
      done(null);
    },
    function (done) {
      if (req.body.protocol1.tide === 'YES') {
        rows.tideConditionsHeader.push('');
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.tideConditions) {
          rows.closestHighTide.push(getDateTime(expedition.protocols.siteCondition.tideConditions.closestHighTide));
          rows.closestHighTideHeight.push(expedition.protocols.siteCondition.tideConditions.closestHighTideHeight);
          rows.closestLowTide.push(getDateTime(expedition.protocols.siteCondition.tideConditions.closestLowTide));
          rows.closestLowTideHeight.push(expedition.protocols.siteCondition.tideConditions.closestLowTideHeight);
        } else {
          rows.closestHighTide.push('');
          rows.closestHighTideHeight.push('');
          rows.closestLowTide.push('');
          rows.closestLowTideHeight.push('');
        }
      }
      done(null);
    },
    // Add Reference Point
    function (done) {
      if (req.body.protocol1.referencePoint === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.tideConditions) {
          rows.referencePoint.push(expedition.protocols.siteCondition.tideConditions.referencePoint);
        } else {
          rows.referencePoint.push('');
        }
      }
      done(null);
    },
    // Add Tidal Current
    function (done) {
      if (req.body.protocol1.tidalCurrent === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.tideConditions && expedition.protocols.siteCondition.tideConditions.tidalCurrent) {
          if (expedition.protocols.siteCondition.tideConditions.tidalCurrent === 'flood-current') {
            rows.tidalCurrent.push('Flood current (incoming tide)');
          } else if (expedition.protocols.siteCondition.tideConditions.tidalCurrent === 'slack-water') {
            rows.tidalCurrent.push('Slack water');
          } else if (expedition.protocols.siteCondition.tideConditions.tidalCurrent === 'ebb-current') {
            rows.tidalCurrent.push('Ebb current (outgoing tide)');
          }
        } else {
          rows.tidalCurrent.push('');
        }
      }
      done(null);
    },
    // Add Water condition photo
    function (done) {
      if (req.body.protocol1.waterConditionPhoto === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions && expedition.protocols.siteCondition.waterConditions.waterConditionPhoto) {
          rows.waterConditionPhoto.push(expedition.protocols.siteCondition.waterConditions.waterConditionPhoto.path);
        } else {
          rows.waterConditionPhoto.push('');
        }
      }
      done(null);
    },
    // Add Surface Current Speed
    function (done) {
      if (req.body.protocol1.surfaceCurrentSpeed === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions) {
          rows.currentSpeed.push(expedition.protocols.siteCondition.waterConditions.surfaceCurrentSpeedMPS);
        } else {
          rows.currentSpeed.push('');
        }
      }
      done(null);
    },
    // Add Water Color
    function (done) {
      if (req.body.protocol1.waterColor === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions && expedition.protocols.siteCondition.waterConditions.waterColor) {
          WaterColor.findOne({ value: expedition.protocols.siteCondition.waterConditions.waterColor })
          .exec(function(err, color) {
            rows.waterColor.push((color) ? color.order : '');
            done(null);
          });
        } else {
          rows.waterColor.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Oil Sheen
    function (done) {
      if (req.body.protocol1.oilSheen === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions) {
          rows.oilSheen.push((expedition.protocols.siteCondition.waterConditions.oilSheen) ? 1 : 0);
        } else {
          rows.oilSheen.push('');
        }
      }
      done(null);
    },
    // Add Garbage Extent (water)
    function (done) {
      if (req.body.protocol1.garbageWater === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions) {
          addGarbageExtent(rows, expedition.protocols.siteCondition.waterConditions.garbage, 'Water', function() {
            done(null);
          });
        } else {
          rows.garbageWater.push('');
          rows.hardPlasticWater.push('');
          rows.softPlasticWater.push('');
          rows.metalWater.push('');
          rows.paperWater.push('');
          rows.glassWater.push('');
          rows.organicWater.push('');
          rows.otherWater.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Marked Pipes
    function (done) {
      if (req.body.protocol1.pipes === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions &&
          expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes) {
          rows.markedCSOPipes.push((expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent) ? 1 : 0);
          if (expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.markedCSOPresent) {
            if (expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location) {
              rows.markedCSOLocation.push(expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.latitude+', '+
                expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.location.longitude);
            } else {
              rows.markedCSOLocation.push('');
            }
            rows.markedCSOFlow.push((expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.flowThroughPresent) ? 1 : 0);
            if (expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough) {
              WaterFlow.findOne({ value: expedition.protocols.siteCondition.waterConditions.markedCombinedSewerOverflowPipes.howMuchFlowThrough })
              .exec(function(err, flow) {
                if (err) done(err);
                rows.markedCSOVolume.push((flow) ? flow.order : '');
                done(null);
              });
            } else {
              rows.markedCSOVolume.push('');
              done(null);
            }
          } else {
            rows.markedCSOLocation.push('');
            rows.markedCSOFlow.push('');
            rows.markedCSOVolume.push('');
            done(null);
          }
        } else {
          rows.markedCSOPipes.push('');
          rows.markedCSOLocation.push('');
          rows.markedCSOFlow.push('');
          rows.markedCSOVolume.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Unmarked Pipes
    function (done) {
      if (req.body.protocol1.pipes === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.waterConditions && expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes) {
          rows.unmarkedPipes.push((expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent) ? 1 : 0);
          if (expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.unmarkedPipePresent) {
            if (expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.location) {
              rows.unmarkedPipesLocation.push(expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.location.latitude+', '+
                expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.location.longitude);
            } else {
              rows.unmarkedPipesLocation.push('');
            }
            rows.unmarkedPipesDiameter.push(expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.approximateDiameterCM);
            rows.unmarkedPipesFlow.push((expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.flowThroughPresent) ? 1 : 0);
            if (expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough) {
              WaterFlow.findOne({ value: expedition.protocols.siteCondition.waterConditions.unmarkedOutfallPipes.howMuchFlowThrough })
              .exec(function(err, flow) {
                if (err) done(err);
                rows.unmarkedPipesVolume.push((flow) ? flow.order : '');
                done(null);
              });
            } else {
              rows.unmarkedPipesVolume.push('');
              done(null);
            }
          } else {
            rows.unmarkedPipesLocation.push('');
            rows.unmarkedPipesDiameter.push('');
            rows.unmarkedPipesFlow.push('');
            rows.unmarkedPipesVolume.push('');
            done(null);
          }
        } else {
          rows.unmarkedPipes.push('');
          rows.unmarkedPipesLocation.push('');
          rows.unmarkedPipesDiameter.push('');
          rows.unmarkedPipesFlow.push('');
          rows.unmarkedPipesVolume.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Land condition photo
    function (done) {
      if (req.body.protocol1.landConditionPhoto === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.landConditions && expedition.protocols.siteCondition.landConditions.landConditionPhoto) {
          rows.landConditionPhoto.push(expedition.protocols.siteCondition.landConditions.landConditionPhoto.path);
        } else {
          rows.landConditionPhoto.push('');
        }
      }
      done(null);
    },
    // Add Shoreline Type
    function (done) {
      if (req.body.protocol1.shorelineType === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.landConditions && expedition.protocols.siteCondition.landConditions.shoreLineType) {
          ShorelineType.findOne({ value: expedition.protocols.siteCondition.landConditions.shoreLineType })
          .exec(function (err, type) {
            if (err) done(err);
            rows.shoreLineType.push((type) ? type.order : '');
            done(null);
          });
        } else {
          rows.shoreLineType.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Garbage Extent (land)
    function (done) {
      if (req.body.protocol1.garbageLand === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.landConditions) {
          addGarbageExtent(rows, expedition.protocols.siteCondition.landConditions.garbage, 'Land', function() {
            done(null);
          });
        } else {
          rows.garbageLand.push('');
          rows.hardPlasticLand.push('');
          rows.softPlasticLand.push('');
          rows.metalLand.push('');
          rows.paperLand.push('');
          rows.glassLand.push('');
          rows.organicLand.push('');
          rows.otherLand.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Shoreline Surface Cover Est Per
    function (done) {
      if (req.body.protocol1.surfaceCover === 'YES') {
        if (expedition.protocols && expedition.protocols.siteCondition && expedition.protocols.siteCondition.landConditions && expedition.protocols.siteCondition.landConditions.shorelineSurfaceCoverEstPer) {
          rows.imperviousSurfacePer.push(expedition.protocols.siteCondition.landConditions.shorelineSurfaceCoverEstPer.imperviousSurfacePer);
          rows.perviousSurfacePer.push(expedition.protocols.siteCondition.landConditions.shorelineSurfaceCoverEstPer.perviousSurfacePer);
          rows.vegetatedSurfacePer.push(expedition.protocols.siteCondition.landConditions.shorelineSurfaceCoverEstPer.vegetatedSurfacePer);
        } else {
          rows.imperviousSurfacePer.push('');
          rows.perviousSurfacePer.push('');
          rows.vegetatedSurfacePer.push('');
        }
      }
      done(null);
    },
    // Add Submerged Depth of Cage
    function (done) {
      if (req.body.protocol2.submergedDepth === 'YES') {
        if (expedition.protocols && expedition.protocols.oysterMeasurement && expedition.protocols.oysterMeasurement.depthOfOysterCage) {
          rows.submergedDepth.push(expedition.protocols.oysterMeasurement.depthOfOysterCage.submergedDepthofCageM);
        } else {
          rows.submergedDepth.push('');
        }
      }
      done(null);
    },
    function (done) {
      if (req.body.protocol2.oysterCagePhoto === 'YES') {
        if (expedition.protocols && expedition.protocols.oysterMeasurement && expedition.protocols.oysterMeasurement.conditionOfOysterCage && expedition.protocols.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto) {
          rows.oysterCagePhoto.push(expedition.protocols.oysterMeasurement.conditionOfOysterCage.oysterCagePhoto.path);
        } else {
          rows.oysterCagePhoto.push('');
        }
      }
      done(null);
    },
    // Add Bioaccumulation on Cage
    function (done) {
      if (req.body.protocol2.bioaccumulationOnCage === 'YES') {
        if (expedition.protocols && expedition.protocols.oysterMeasurement && expedition.protocols.oysterMeasurement.conditionOfOysterCage && expedition.protocols.oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage) {
          Bioaccumulation.findOne({ value: expedition.protocols.oysterMeasurement.conditionOfOysterCage.bioaccumulationOnCage })
            .exec(function(err, bio) {
              if (err) done(err);
              rows.bioaccumulationOnCage.push((bio) ? bio.order : '');
              done(null);
            });
        } else {
          rows.bioaccumulationOnCage.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Damage to Cage
    function (done) {
      if (req.body.protocol2.cageDamage === 'YES') {
        if (expedition.protocols && expedition.protocols.oysterMeasurement && expedition.protocols.oysterMeasurement.conditionOfOysterCage) {
          rows.cageDamage.push(expedition.protocols.oysterMeasurement.conditionOfOysterCage.notesOnDamageToCage);
        } else {
          rows.cageDamage.push('');
        }
      }
      done(null);
    },
    // Add Oyster Measurements
    function (done) {
      if (req.body.protocol2.oysterMeasurements === 'YES') {
        rows.oysterMeasurementsHeader.push('');
        if (expedition.protocols && expedition.protocols.oysterMeasurement) {
          rows.minSizeOfAllOysters.push(expedition.protocols.oysterMeasurement.minimumSizeOfAllLiveOysters);
          rows.maxSizeOfAllOysters.push(expedition.protocols.oysterMeasurement.maximumSizeOfAllLiveOysters);
          rows.avgSizeOfAllOysters.push(expedition.protocols.oysterMeasurement.averageSizeOfAllLiveOysters);
          rows.totalOfAllOysters.push(expedition.protocols.oysterMeasurement.totalNumberOfAllLiveOysters);
          if (expedition.protocols.oysterMeasurement.measuringOysterGrowth && expedition.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells) {
            for (var n = 0; n < expedition.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells.length; n++) {
              var substrateShell = expedition.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells[n];
              var shellIndex = substrateShell.substrateShellNumber-1;
              var baselineArray = expedition.station.baselines['substrateShell'+(n+1)];
              var baseline = baselineArray[baselineArray.length-1];
              rows.substrateShells[shellIndex].substrateShellNumberHeader.push('');
              if (substrateShell) {
                if (substrateShell.outerSidePhoto) {
                  rows.substrateShells[shellIndex].outerSidePhoto.push(substrateShell.outerSidePhoto.path);
                } else {
                  rows.substrateShells[shellIndex].outerSidePhoto.push('');
                }
                if (substrateShell.innerSidePhoto) {
                  rows.substrateShells[shellIndex].innerSidePhoto.push(substrateShell.innerSidePhoto.path);
                } else {
                  rows.substrateShells[shellIndex].innerSidePhoto.push('');
                }
                rows.substrateShells[shellIndex].setDate.push(getShortDate((baseline) ? baseline.setDate : ''));
                rows.substrateShells[shellIndex].source.push((baseline) ? ((baseline.otherSource) ? baseline.otherSource : baseline.source) : '');
                rows.substrateShells[shellIndex].liveAtBaseline.push((baseline) ? baseline.totalNumberOfLiveOystersAtBaseline : '');
                rows.substrateShells[shellIndex].massAtBaseline.push((baseline) ? baseline.totalMassOfLiveOystersAtBaselineG : '');
                rows.substrateShells[shellIndex].liveOnShell.push(substrateShell.totalNumberOfLiveOystersOnShell);
                rows.substrateShells[shellIndex].mass.push(substrateShell.totalMassOfScrubbedSubstrateShellOystersTagG);
                rows.substrateShells[shellIndex].minSize.push(substrateShell.minimumSizeOfLiveOysters);
                rows.substrateShells[shellIndex].maxSize.push(substrateShell.maximumSizeOfLiveOysters);
                rows.substrateShells[shellIndex].avgSize.push(substrateShell.averageSizeOfLiveOysters);
                var measurements = [];
                if (substrateShell.measurements) {
                  for (var o = 0; o < substrateShell.measurements.length; o++) {
                    if (substrateShell.measurements[o].sizeOfLiveOysterMM) {
                      measurements.push(substrateShell.measurements[o].sizeOfLiveOysterMM);
                    }
                  }
                  rows.substrateShells[shellIndex].measurements.push(measurements.join(','));
                } else {
                  rows.substrateShells[shellIndex].measurements.push('');
                }
              }
            }
          }
        } else {
          rows.minSizeOfAllOysters.push('');
          rows.maxSizeOfAllOysters.push('');
          rows.avgSizeOfAllOysters.push('');
          rows.totalOfAllOysters.push('');
        }
      }
      done(null);
    },
    // Add Mobile Organisms
    function (done) {
      if (req.body.protocol3.organism === 'YES') {
        var addMobileOrganism = function(index, mobileOrganisms, organisms, callback) {
          if (index < mobileOrganisms.length) {
            getMobileOrganismNameAndImage(mobileOrganisms[index].organism, function(err, commonName, imagePath) {
              if (err) done(err);
              var image = (mobileOrganisms[index].sketchPhoto && mobileOrganisms[index].sketchPhoto.path) ?
                mobileOrganisms[index].sketchPhoto.path : imagePath;
              organisms.push(mobileOrganisms[index].count + ' ' + commonName + '\r\n' + image);
              addMobileOrganism(index+1, mobileOrganisms, organisms, callback);
            });
          } else {
            callback(organisms);
          }
        };
        if (expedition.protocols && expedition.protocols.mobileTrap && expedition.protocols.mobileTrap.mobileOrganisms) {
          addMobileOrganism(0, expedition.protocols.mobileTrap.mobileOrganisms, [], function(organisms) {
            rows.mobileOrganisms.push(organisms.join(',\r\n\r\n'));
            done(null);
          });
        } else {
          rows.mobileOrganisms.push('');
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Settlement Tile Description
    function (done) {
      if (req.body.protocol4.description === 'YES') {
        if (expedition.protocols && expedition.protocols.settlementTiles && expedition.protocols.settlementTiles.settlementTiles) {
          for (var i = 0; i < expedition.protocols.settlementTiles.settlementTiles.length; i++) {
            if (expedition.protocols.settlementTiles.settlementTiles[i]) {

              console.log('tile', rows.settlementTiles[i]);
              if (expedition.protocols.settlementTiles.settlementTiles[i].tilePhoto) {
                rows.settlementTiles[i].tilePhoto.push(expedition.protocols.settlementTiles.settlementTiles[i].tilePhoto.path);
              } else {
                rows.settlementTiles[i].tilePhoto.push('');
              }
              rows.settlementTiles[i].description.push(expedition.protocols.settlementTiles.settlementTiles[i].description);
            } else {
              rows.settlementTiles[i].tilePhoto.push('');
              rows.settlementTiles[i].description.push('');
            }
          }
        }
      }
      done(null);
    },
    // Add Settlement Tile Organisms
    function (done) {
      if (req.body.protocol4.organism === 'YES') {
        var addSessileOrganism = function(index, tile, tileNumber, callback) {
          if (index < 26) {
            getSessileOrganismNameAndImage(tile['grid'+index].organism, function(err, commonName, imagePath) {
              if (err) done (err);
              rows.settlementTiles[tileNumber]['grid'+index+'-organism'].push((commonName) ? commonName : '');
              rows.settlementTiles[tileNumber]['grid'+index+'-photo'].push((imagePath) ? imagePath : '');
              rows.settlementTiles[tileNumber]['grid'+index+'-notes'].push((tile['grid'+index].notes) ?
                tile['grid'+index].notes : '');
              addSessileOrganism(index+1, tile, tileNumber, callback);
            });
          } else {
            callback();
          }
        };
        if (expedition.protocols && expedition.protocols.settlementTiles && expedition.protocols.settlementTiles.settlementTiles) {
          addSessileOrganism(1, expedition.protocols.settlementTiles.settlementTiles[0], 0, function() {
            rows.settlementTiles[0].settlementTileNumberHeader.push('');
            rows.settlementTiles[0].organismsHeader.push('');
            addSessileOrganism(1, expedition.protocols.settlementTiles.settlementTiles[1], 1, function() {
              rows.settlementTiles[1].settlementTileNumberHeader.push('');
              rows.settlementTiles[1].organismsHeader.push('');
              addSessileOrganism(1, expedition.protocols.settlementTiles.settlementTiles[2], 2, function() {
                rows.settlementTiles[2].settlementTileNumberHeader.push('');
                rows.settlementTiles[2].organismsHeader.push('');
                addSessileOrganism(1, expedition.protocols.settlementTiles.settlementTiles[3], 3, function() {
                  rows.settlementTiles[3].settlementTileNumberHeader.push('');
                  rows.settlementTiles[3].organismsHeader.push('');
                  done(null);
                });
              });
            });
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Water Sample #
    function (done) {
      if (req.body.protocol5.depth === 'YES' || req.body.protocol5.temperature === 'YES' ||
      req.body.protocol5.dissolvedOxygen === 'YES' || req.body.protocol5.salinity === 'YES' ||
      req.body.protocol5.pH === 'YES' || req.body.protocol5.turbidity === 'YES' ||
      req.body.protocol5.ammonia === 'YES' || req.body.protocol5.nitrates === 'YES' ||
      req.body.protocol5.other === 'YES') {
        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          for (var i = 0; i < expedition.protocols.waterQuality.samples.length; i++) {
            rows.waterSamples[i].sampleNumberHeader.push('');
          }
        }
      }
      done(null);
    },
    // Add Depth of Water Sample
    function (done) {
      if (req.body.protocol5.depth === 'YES') {
        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          for (var i = 0; i < maxSamples; i++) {
            if (expedition.protocols.waterQuality.samples[i]) {
              rows.waterSamples[i].depth.push(expedition.protocols.waterQuality.samples[i].depthOfWaterSampleM);
              if (expedition.protocols.waterQuality.samples[i].locationOfWaterSample) {
                rows.waterSamples[i].location.push(expedition.protocols.waterQuality.samples[i].locationOfWaterSample.latitude + ', ' +
                  expedition.protocols.waterQuality.samples[i].locationOfWaterSample.longitude);
              } else {
                rows.waterSamples[i].location.push('');
              }
            } else {
              rows.waterSamples[i].depth.push('');
              rows.waterSamples[i].location.push('');
            }
          }
        }
      }
      done(null);
    },
    // Add Water Temperature
    function (done) {
      if (req.body.protocol5.temperature === 'YES') {
        var addWaterTemperature = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            rows.waterSamples[index].waterTemperatureHeader.push('');
            WaterTemperatureMethod.findOne({ value: sample.waterTemperature.method }).exec(function(err, method) {
              if (err) done(err);
              rows.waterSamples[index].waterTemperatureMethod.push((method) ? method.label : '');
              WaterTemperatureUnit.findOne({ value: sample.waterTemperature.units }).exec(function(err, unit) {
                if (err) done(err);
                rows.waterSamples[index].waterTemperatureUnit.push((unit) ? unit.label : '');
                rows.waterSamples[index].waterTemperatureResults.push(sample.waterTemperature.results);
                rows.waterSamples[index].waterTemperatureAverage.push(sample.waterTemperature.average);
                addWaterTemperature(index+1, samples, maxSamples, callback);
              });
            });
          } else if (index < maxSamples) {
            rows.waterSamples[index].waterTemperatureHeader.push('');
            rows.waterSamples[index].waterTemperatureMethod.push('');
            rows.waterSamples[index].waterTemperatureUnit.push('');
            rows.waterSamples[index].waterTemperatureResults.push('');
            rows.waterSamples[index].waterTemperatureAverage.push('');
            addWaterTemperature(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addWaterTemperature(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Dissolved Oxygen
    function (done) {
      if (req.body.protocol5.dissolvedOxygen === 'YES') {
        var addDissolvedOxygen = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            rows.waterSamples[index].dissolvedOxygenHeader.push('');
            DissolvedOxygenMethod.findOne({ value: sample.dissolvedOxygen.method }).exec(function(err, method) {
              if (err) done(err);
              rows.waterSamples[index].dissolvedOxygenMethod.push((method) ? method.label : '');
              DissolvedOxygenUnit.findOne({ value: sample.dissolvedOxygen.units }).exec(function(err, unit) {
                if (err) done(err);
                rows.waterSamples[index].dissolvedOxygenUnit.push((unit) ? unit.label : '');
                rows.waterSamples[index].dissolvedOxygenResults.push(sample.dissolvedOxygen.results);
                rows.waterSamples[index].dissolvedOxygenAverage.push(sample.dissolvedOxygen.average);
                addDissolvedOxygen(index+1, samples, maxSamples, callback);
              });
            });
          } else if (index < maxSamples) {
            rows.waterSamples[index].dissolvedOxygenHeader.push('');
            rows.waterSamples[index].dissolvedOxygenMethod.push('');
            rows.waterSamples[index].dissolvedOxygenUnit.push('');
            rows.waterSamples[index].dissolvedOxygenResults.push('');
            rows.waterSamples[index].dissolvedOxygenAverage.push('');
            addDissolvedOxygen(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addDissolvedOxygen(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Salinity
    function (done) {
      if (req.body.protocol5.salinity === 'YES') {
        var addSalinity = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            rows.waterSamples[index].salinityHeader.push('');
            SalinityMethod.findOne({ value: sample.salinity.method }).exec(function(err, method) {
              if (err) done(err);
              rows.waterSamples[index].salinityMethod.push((method) ? method.label : '');
              SalinityUnit.findOne({ value: sample.salinity.units }).exec(function(err, unit) {
                if (err) done(err);
                rows.waterSamples[index].salinityUnit.push((unit) ? unit.label : '');
                rows.waterSamples[index].salinityResults.push(sample.salinity.results);
                rows.waterSamples[index].salinityAverage.push(sample.salinity.average);
                addSalinity(index+1, samples, maxSamples, callback);
              });
            });
          } else if (index < maxSamples) {
            rows.waterSamples[index].salinityHeader.push('');
            rows.waterSamples[index].salinityMethod.push('');
            rows.waterSamples[index].salinityUnit.push('');
            rows.waterSamples[index].salinityResults.push('');
            rows.waterSamples[index].salinityAverage.push('');
            addSalinity(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addSalinity(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add pH
    function (done) {
      if (req.body.protocol5.pH === 'YES') {
        var addPh = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            rows.waterSamples[index].pHHeader.push('');
            PhMethod.findOne({ value: sample.pH.method }).exec(function(err, method) {
              if (err) done(err);
              rows.waterSamples[index].pHMethod.push((method) ? method.label : '');
              PhUnit.findOne({ value: sample.pH.units }).exec(function(err, unit) {
                if (err) done(err);
                rows.waterSamples[index].pHUnit.push((unit) ? unit.label : '');
                rows.waterSamples[index].pHResults.push(sample.pH.results);
                rows.waterSamples[index].pHAverage.push(sample.pH.average);
                addPh(index+1, samples, maxSamples, callback);
              });
            });
          } else if (index < maxSamples) {
            rows.waterSamples[index].pHHeader.push('');
            rows.waterSamples[index].pHMethod.push('');
            rows.waterSamples[index].pHUnit.push('');
            rows.waterSamples[index].pHResults.push('');
            rows.waterSamples[index].pHAverage.push('');
            addPh(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addPh(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Turbidity
    function (done) {
      if (req.body.protocol5.turbidity === 'YES') {
        var addTurbidity = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            if (sample && sample.turbidity && sample.turbidity.method && sample.turbidity.units) {
              rows.waterSamples[index].turbidityHeader.push('');
              TurbidityMethod.findOne({ value: sample.turbidity.method }).exec(function(err, method) {
                if (err) done(err);
                rows.waterSamples[index].turbidityMethod.push((method) ? method.label : '');
                TurbidityUnit.findOne({ value: sample.turbidity.units }).exec(function(err, unit) {
                  if (err) done(err);
                  rows.waterSamples[index].turbidityUnit.push((unit) ? unit.label : '');
                  rows.waterSamples[index].turbidityResults.push(sample.turbidity.results);
                  rows.waterSamples[index].turbidityAverage.push(sample.turbidity.average);
                  addTurbidity(index+1, samples, maxSamples, callback);
                });
              });
            } else {
              rows.waterSamples[index].turbidityHeader.push('');
              rows.waterSamples[index].turbidityMethod.push('');
              rows.waterSamples[index].turbidityUnit.push('');
              rows.waterSamples[index].turbidityResults.push('');
              rows.waterSamples[index].turbidityAverage.push('');
              addTurbidity(index+1, samples, maxSamples, callback);
            }
          } else if (index < maxSamples) {
            rows.waterSamples[index].turbidityHeader.push('');
            rows.waterSamples[index].turbidityMethod.push('');
            rows.waterSamples[index].turbidityUnit.push('');
            rows.waterSamples[index].turbidityResults.push('');
            rows.waterSamples[index].turbidityAverage.push('');
            addTurbidity(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addTurbidity(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Ammonia
    function (done) {
      if (req.body.protocol5.ammonia === 'YES') {
        var addAmmonia = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            if (sample && sample.ammonia && sample.ammonia.method && sample.ammonia.units) {
              rows.waterSamples[index].ammoniaHeader.push('');
              AmmoniaMethod.findOne({ value: sample.ammonia.method }).exec(function(err, method) {
                if (err) done(err);
                rows.waterSamples[index].ammoniaMethod.push((method) ? method.label : '');
                AmmoniaUnit.findOne({ value: sample.ammonia.units }).exec(function(err, unit) {
                  if (err) done(err);
                  rows.waterSamples[index].ammoniaUnit.push((unit) ? unit.label : '');
                  rows.waterSamples[index].ammoniaResults.push(sample.ammonia.results);
                  rows.waterSamples[index].ammoniaAverage.push(sample.ammonia.average);
                  addAmmonia(index+1, samples, maxSamples, callback);
                });
              });
            } else {
              rows.waterSamples[index].ammoniaHeader.push('');
              rows.waterSamples[index].ammoniaMethod.push('');
              rows.waterSamples[index].ammoniaUnit.push('');
              rows.waterSamples[index].ammoniaResults.push('');
              rows.waterSamples[index].ammoniaAverage.push('');
              addAmmonia(index+1, samples, maxSamples, callback);
            }
          } else if (index < maxSamples) {
            rows.waterSamples[index].ammoniaHeader.push('');
            rows.waterSamples[index].ammoniaMethod.push('');
            rows.waterSamples[index].ammoniaUnit.push('');
            rows.waterSamples[index].ammoniaResults.push('');
            rows.waterSamples[index].ammoniaAverage.push('');
            addAmmonia(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addAmmonia(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Nitrate
    function (done) {
      if (req.body.protocol5.nitrates === 'YES') {
        var addNitrate = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            if (sample && sample.nitrates && sample.nitrates.method && sample.nitrates.units) {
              rows.waterSamples[index].nitrateHeader.push('');
              NitrateMethod.findOne({ value: sample.nitrates.method }).exec(function(err, method) {
                if (err) done(err);
                rows.waterSamples[index].nitrateMethod.push((method) ? method.label : '');
                NitrateUnit.findOne({ value: sample.nitrates.units }).exec(function(err, unit) {
                  if (err) done(err);
                  rows.waterSamples[index].nitrateUnit.push((unit) ? unit.label : '');
                  rows.waterSamples[index].nitrateResults.push(sample.nitrates.results);
                  rows.waterSamples[index].nitrateAverage.push(sample.nitrates.average);
                  addNitrate(index+1, samples, maxSamples, callback);
                });
              });
            } else {
              rows.waterSamples[index].nitrateHeader.push('');
              rows.waterSamples[index].nitrateMethod.push('');
              rows.waterSamples[index].nitrateUnit.push('');
              rows.waterSamples[index].nitrateResults.push('');
              rows.waterSamples[index].nitrateAverage.push('');
              addNitrate(index+1, samples, maxSamples, callback);
            }
          } else if (index < maxSamples) {
            rows.waterSamples[index].nitrateHeader.push('');
            rows.waterSamples[index].nitrateMethod.push('');
            rows.waterSamples[index].nitrateUnit.push('');
            rows.waterSamples[index].nitrateResults.push('');
            rows.waterSamples[index].nitrateAverage.push('');
            addNitrate(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addNitrate(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },
    // Add Other
    function (done) {
      if (req.body.protocol5.other === 'YES') {
        var addOther = function(index, samples, maxSamples, callback) {
          if (index < samples.length) {
            var sample = samples[index];
            if (sample && sample.others[0] && sample.others[0].label &&
              sample.others[0].method && sample.others[0].units) {
              rows.waterSamples[index].otherHeader.push('');
              rows.waterSamples[index].otherLabel.push(sample.others[0].label);
              rows.waterSamples[index].otherMethod.push(sample.others[0].method);
              rows.waterSamples[index].otherUnit.push(sample.others[0].units);
              rows.waterSamples[index].otherResults.push(sample.others[0].results);
              rows.waterSamples[index].otherAverage.push(sample.others[0].average);
              addOther(index+1, samples, maxSamples, callback);
            } else {
              rows.waterSamples[index].otherHeader.push('');
              rows.waterSamples[index].otherLabel.push('');
              rows.waterSamples[index].otherMethod.push('');
              rows.waterSamples[index].otherUnit.push('');
              rows.waterSamples[index].otherResults.push('');
              rows.waterSamples[index].otherAverage.push('');
              addOther(index+1, samples, maxSamples, callback);
            }
          } else if (index < maxSamples) {
            rows.waterSamples[index].otherHeader.push('');
            rows.waterSamples[index].otherLabel.push('');
            rows.waterSamples[index].otherMethod.push('');
            rows.waterSamples[index].otherUnit.push('');
            rows.waterSamples[index].otherResults.push('');
            rows.waterSamples[index].otherAverage.push('');
            addOther(index+1, samples, maxSamples, callback);
          } else {
            callback();
          }
        };

        if (expedition.protocols && expedition.protocols.waterQuality && expedition.protocols.waterQuality.samples) {
          addOther(0, expedition.protocols.waterQuality.samples, maxSamples, function() {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    }
  ], function(err) {
    if (err) {
      console.log('done err', err);
      callback(err);
    } else {
      callback();
    }
  });
};

var createCsv = function(req, expeditions, callback) {
  var csvArrays = [];
  var headers = [''];
  var rows = {
    weatherConditions: ['Weather conditions\r\n'+
    '(1=Sunny,2=Partly Cloudy,3=Cloudy,4=Rain,\r\n'+
    '5=Fog,6=Snow,7=Hail,8=Thunderstorm)'],
    windDirection: ['Wind direction'],
    windSpeedMPH: ['Wind speed (mph)'],
    airTemperatureC: ['Air temperature (C)'],
    humidityPer: ['Humidity (%)'],
    recentRainfallHeader: ['Recent Rainfall'],
    rainfall24hrs: ['24 hrs rainfall\r\n'+'(1=Yes,0=No)'],
    rainfall72hrs: ['72 hrs rainfall\r\n'+'(1=Yes,0=No)'],
    rainfall7days: ['7 days rainfall\r\n'+'(1=Yes,0=No)'],
    tideConditionsHeader: ['Tide conditions'],
    referencePoint: ['Reference Point (location name)'],
    closestHighTide: ['Closest High Tide (date, time)'],
    closestHighTideHeight: ['Closest High Tide Height (ft)'],
    closestLowTide: ['Closest Low Tide (date, time)'],
    closestLowTideHeight: ['Closest Low Tide Height (ft)'],
    currentSpeed: ['Current speed (m/s)'],
    tidalCurrent: ['Tidal Current'],
    waterConditions: ['Water Conditions'],
    waterConditionPhoto: ['Water condition photo'],
    waterColor: ['Water color\r\n'+
    '(1=Light Blue,2=Dark Blue,3=Light Green,\r\n'+
    '4=Dark Green,5=Light Brown,6=Dark Brown)'],
    oilSheen: ['Oil sheen present?\r\n'+'(1=Yes,0=No)'],
    garbageWater: ['Garbage in water?\r\n'+'(1=Yes,0=No)'],
    hardPlasticWater: ['If Y, Type and Extent for Hard Plastic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    softPlasticWater: ['If Y, Type and Extent for Soft Plastic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    metalWater: ['If Y, Type and Extent for Metal\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    paperWater: ['If Y, Type and Extent for Paper\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    glassWater: ['If Y, Type and Extent for Glass\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    organicWater: ['If Y, Type and Extent for Organic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    otherWater: ['Other/Notes'],
    markedCSOPipes: ['Marked Combined Sewer Overflow (CSO) pipes?\r\n'+'(1=Yes,0=No)'],
    markedCSOLocation: ['Location? (coordinates)'],
    markedCSOFlow: ['Flow?\r\n'+'(1=Yes,0=No)'],
    markedCSOVolume: ['Volume?\r\n'+
    '(1=Trickle,2=Light Stream,\r\n'+
    '3=Steady Stream,4=Full Flow)'],
    unmarkedPipes: ['Unmarked or other outfall pipes? Y/N\r\n'+'(1=Yes,0=No)'],
    unmarkedPipesLocation: ['Location? (coordinates)'],
    unmarkedPipesDiameter: ['Approximate diameter of pipe (cm)?'],
    unmarkedPipesFlow: ['Flow?\r\n'+'(1=Yes,0=No)'],
    unmarkedPipesVolume: ['Volume?\r\n'+
    '(1=Trickle,2=Light Stream,\r\n'+
    '3=Steady Stream,4=Full Flow)'],
    landConditions: ['Land Conditions'],
    landConditionPhoto: ['Land condition photo'],
    shoreLineType: ['Shoreline type\r\n'+
    '(1,Bulkhead/Wall,2=Fixed Pier,3=Floating Dock,\r\n'+
    '4=Riprap/Rocky Shoreline,5=Dirt/Sand,6=Other)'],
    imperviousSurfacePer: ['% surface cover of adjacent shoreline (500 x 500 ft) that is Impervious Surface (concrete/asphalt paths, roads, buildings etc.)'],
    perviousSurfacePer: ['% surface cover of adjacent shoreline (500 x 500 ft) that is Pervious Surface (dirt, gravel etc.)'],
    vegetatedSurfacePer: ['% surface cover for adjacent shoreline (500 x 500 ft) that is Vegetated surface (grass, shrubs, trees)'],
    garbageLand: ['Garbage in water?\r\n'+'(1=Yes,0=No)'],
    hardPlasticLand: ['If Y, Type and Extent for Hard Plastic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    softPlasticLand: ['If Y, Type and Extent for Soft Plastic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    metalLand: ['If Y, Type and Extent for Metal\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    paperLand: ['If Y, Type and Extent for Paper\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    glassLand: ['If Y, Type and Extent for Glass\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    organicLand: ['If Y, Type and Extent for Organic\r\n'+
    '(1=None,2=Sporadic,3=Common,4=Extensive)'],
    otherLand: ['Other/Notes'],

    submergedDepth: ['Submerged depth of cage (m)'],
    oysterCagePhoto: ['Oyster cage photo'],
    bioaccumulationOnCage: ['Bioaccumulation on cage\r\n'+
    '(1=None/clean,2=Light,3=Medium,4=Heavy)'],
    cageDamage: ['Cage damage'],
    oysterMeasurementsHeader: ['Oyster Measurements (mm)'],
    substrateShells: [],
    minSizeOfAllOysters: ['Minimum size of all live oysters (mm)'],
    maxSizeOfAllOysters: ['Maximum size of all live oysters (mm)'],
    avgSizeOfAllOysters: ['Average size of all live oysters (mm)'],
    totalOfAllOysters: ['Total number of all live oysters'],

    mobileOrganisms: ['Mobile Organisms Observed'],

    settlementTiles: [],

    waterSamples: []
  };

  if (req.body.protocol2.oysterMeasurements === 'YES') {
    for (var i = 1; i < 11; i++) {
      rows.substrateShells.push({
        substrateShellNumberHeader: ['Substrate Shell #'+i],
        outerSidePhoto: ['Outer side photo'],
        innerSidePhoto: ['Inner side photo'],
        setDate: ['Set date'],
        source: ['Source'],
        liveAtBaseline: ['Total number of live oysters at baseline'],
        massAtBaseline: ['Total mass of live oysters at baseline (g)'],
        liveOnShell: ['Total number of live oysters on shell'],
        mass: ['Total mass of scrubbed substrate shell + oysters + tag (g)'],
        measurements: ['Measurements (mm)'],
        minSize: ['Minimum size of live oysters (mm)'],
        maxSize: ['Maximum size of live oysters (mm)'],
        avgSize: ['Average size of live oysters (mm)'],
      });
    }
  }

  if (req.body.protocol4.organism === 'YES') {
    for (var j = 1; j < 5; j++) {
      var tile = {
        settlementTileNumberHeader: ['Settlement Tile #'+j],
        tilePhoto: ['Settlement Tile #' + j + ' photo'],
        description: ['Settlement Tile #' + j + ' description'],
        organismsHeader: ['Sessile organisms observed']
      };
      for (var n = 1; n < 26; n++) {
        tile['grid'+n+'-organism'] = ['Grid #' + n + ' organism'];
        tile['grid'+n+'-photo'] = ['Grid #' + n + ' photo'];
        tile['grid'+n+'-notes'] = ['Grid #' + n + ' notes'];
      }

      rows.settlementTiles.push(tile);
    }
  }

  var maxSamples = 0;
  if (req.body.protocol5.depth === 'YES' || req.body.protocol5.temperature === 'YES' ||
  req.body.protocol5.dissolvedOxygen === 'YES' || req.body.protocol5.salinity === 'YES' ||
  req.body.protocol5.pH === 'YES' || req.body.protocol5.turbidity === 'YES' ||
  req.body.protocol5.ammonia === 'YES' || req.body.protocol5.nitrates === 'YES' ||
  req.body.protocol5.other === 'YES') {
    for (var k = 0; k < expeditions.length; k++) {
      if (expeditions[k] && expeditions[k].protocols && expeditions[k].protocols.waterQuality &&
        expeditions[k].protocols.waterQuality.samples && expeditions[k].protocols.waterQuality.samples.length > maxSamples) {
        maxSamples = expeditions[k].protocols.waterQuality.samples.length;
      }
    }
    for (var m = 1; m <= maxSamples; m++) {
      rows.waterSamples.push({
        sampleNumberHeader: ['Water Quality Sample #'+m],
        depth: ['Depth (m)'],
        location: ['Location (coordinates)'],
        waterTemperatureHeader: ['Water Temperature'],
        waterTemperatureMethod: ['Method'],
        waterTemperatureUnit: ['Unit'],
        waterTemperatureResults: ['Results'],
        waterTemperatureAverage: ['Average'],
        dissolvedOxygenHeader: ['Dissolved Oxygen'],
        dissolvedOxygenMethod: ['Method'],
        dissolvedOxygenUnit: ['Unit'],
        dissolvedOxygenResults: ['Results'],
        dissolvedOxygenAverage: ['Average'],
        salinityHeader: ['Salinity'],
        salinityMethod: ['Method'],
        salinityUnit: ['Unit'],
        salinityResults: ['Results'],
        salinityAverage: ['Average'],
        pHHeader: ['pH'],
        pHMethod: ['Method'],
        pHUnit: ['Unit'],
        pHResults: ['Results'],
        pHAverage: ['Average'],
        turbidityHeader: ['Turbidity'],
        turbidityMethod: ['Method'],
        turbidityUnit: ['Unit'],
        turbidityResults: ['Results'],
        turbidityAverage: ['Average'],
        ammoniaHeader: ['Ammonia'],
        ammoniaMethod: ['Method'],
        ammoniaUnit: ['Unit'],
        ammoniaResults: ['Results'],
        ammoniaAverage: ['Average'],
        nitrateHeader: ['Nitrates'],
        nitrateMethod: ['Method'],
        nitrateUnit: ['Unit'],
        nitrateResults: ['Results'],
        nitrateAverage: ['Average'],
        otherHeader: ['Other'],
        otherLabel: ['Label'],
        otherMethod: ['Method'],
        otherUnit: ['Unit'],
        otherResults: ['Results'],
        otherAverage: ['Average']
      });
    }
  }

  var addEachExpedition = function(index, expeditions, callback) {
    if (index < expeditions.length) {
      var expedition = expeditions[index];
      addExpeditionToColumn(expedition, headers, rows, req, maxSamples, function() {
        addEachExpedition(index+1, expeditions, callback);
      });
    } else {
      callback();
    }
  };

  var emptyStringCheck = function(value) {
    return value === '';
  };

  addEachExpedition(0, expeditions, function() {
    csvArrays.push(headers);
    for (var value in rows) {
      if (typeof rows[value][0] === 'object') {
        for (var i in rows[value]) {
          if (typeof rows[value][i] === 'object') {
            for (var array in rows[value][i]) {
              if (rows[value][i][array].length > 1 &&
                (!rows[value][i][array].slice(1, rows[value][i][array].length).every(emptyStringCheck) ||
                array.includes('Header'))) csvArrays.push(rows[value][i][array]);
            }
          } else {
            if (rows[value][i].length > 1 &&
              (!rows[value][i].slice(1, rows[value][i].length).every(emptyStringCheck) ||
              i.includes('Header'))) csvArrays.push(rows[value][i]);
          }
        }
      } else {
        if (rows[value].length > 1 &&
          (!rows[value].slice(1, rows[value].length).every(emptyStringCheck) ||
          value.includes('Header'))) csvArrays.push(rows[value]);
      }
    }

    callback(csvArrays);
  });
};


module.exports = {
  buildSearchQuery: buildSearchQuery,
  buildCompareQuery: buildCompareQuery,
  createCsv: createCsv,
};
