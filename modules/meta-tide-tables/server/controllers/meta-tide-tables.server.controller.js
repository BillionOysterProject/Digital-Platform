'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  parser = require('xml2json'),
  request = require('request'),
  moment = require('moment');

var stationId = '8518750';

/**
 * List Tide Tables
 */
exports.tideTables = function (req, res) {
  var startDate = req.query.startDate || moment().format('YYYYMMDD');
  var endDate = req.query.endDate || moment().add(6, 'day').format('YYYYMMDD');

  var tideTableUrl = 'http://opendap.co-ops.nos.noaa.gov/axis/webservices/highlowtidepred/response.jsp?' + 
    'stationId=' + stationId + '&beginDate=' + startDate + '&endDate=' + endDate + 
    '&datum=MLLW&unit=1&timeZone=0&format=xml&Submit=Submit';

  request(tideTableUrl,
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var tidesObject = parser.toJson(body, {
          object: true
        });
        res.json(tidesObject['soapenv:Envelope']['soapenv:Body'].HighLowAndMetadata);
      } else {
        return res.status(400).send({
          message: 'Tides not available'
        });
      }
    }
  );
};