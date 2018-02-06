'use strict';

var url = require('url'),
  request = require('request'),
  querystring = require('querystring'),
  DEFAULT_PIVOT_URI = 'http://localhost:29029';

function Pivot() {
  this.url = DEFAULT_PIVOT_URI;
}

function Collection(name, client) {
  this.name = name;
  this.client = client;
}

Pivot.prototype.setUrl = function(url) {
  this.url = url;
};

Pivot.prototype.collection = function(name) {
  return new Collection(name, this);
};

Pivot.prototype.request = function(path, callback, options) {
  var requestUrl = url.resolve(this.url, path);

  if (options) {
    if (options.sort instanceof Array) {
      options.sort = options.sort.join(',');
    }

    if (options.limit === false) {
      options.limit = 2147483647;
    }

    requestUrl += '?' + querystring.stringify(options);
  }

  return request(requestUrl, {
    json: true,
  }, function(err, res, body) {
    if (res.statusCode >= 400) {
      err = 'HTTP ' + res.statusCode;

      if (body.error) {
        err += ': ' + body.error;
      }
    }

    callback(err, res, body);
  });
};

Collection.prototype.all = function(callback, options) {
  this.query('all', callback, options);
};


Collection.prototype.query = function(filter, callback, options) {
  this.client.request(
    '/api/collections/' + this.name + '/where/' + filter,
    function(err, res, body) {
      var records = [];

      body.records.forEach(function(record, i) {
        var r = (record.fields || {});
        r.id = record.id;
        records.push(r);
      });

      callback(err, records);
    },
    options
  );
};

Collection.prototype.get = function(id, callback, options) {
  this.client.request(
    '/api/collections/' + this.name + '/records/' + id,
    function(err, res, body) {
      var record = (body.fields || {});
      record.id = body.id;
      callback(err, record);
    },
    options
  );
};


var pivot = module.exports = exports = new Pivot();
