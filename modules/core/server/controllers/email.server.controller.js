'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  ses = require('nodemailer-ses-transport');

var from = process.env.MAILER_FROM || 'Billion Oyster Project <bop@fearless.tech>';

var transporter = nodemailer.createTransport(ses(config.mailer.options.ses));

var toAddresses = function(to) {
  if (_.isArray(to)) {
    return to.join(', ');
  } else {
    return to;
  }
};

var runTemplate = function(string, data) {
  console.log('data', data);
  var compiled = _.template(string);
  return compiled(data);

  // for (var key in data) {
  //   console.log('key', key);
  //   console.log('value', data[key]);
  //
  //   string = _.replace(string, /{{key}}/g, data[key]);
  // }
  // return string;
};


/**
 * Send email
 */
exports.sendEmail = function(to, subject, bodyText, bodyHtml, successCallback, errorCallback) {
  if (to && subject && bodyText && bodyHtml) {
    to = toAddresses(to);

    transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml
    }, function(err, info) {
      if (err) errorCallback(err.message);
      successCallback(info);
    });
  } else {
    errorCallback('Must have to address(es), subject, and body');
  }
};

exports.sendEmailTemplate = function(to, subject, bodyTemplate, data, successCallback, errorCallback) {
  if (to && subject && bodyTemplate && data) {
    to = toAddresses(to);

    var textContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-text/' + bodyTemplate + '.txt'), 'binary');
    //console.log('textContent', textContent);

    var htmlContent = fs.readFileSync(
      path.resolve('./modules/core/server/templates/email-html/' + bodyTemplate + '.html'), 'binary');
    console.log('htmlContent', htmlContent);

    var bodyText = runTemplate(textContent, data);
    //console.log('bodyText', bodyText);
    var bodyHtml = runTemplate(htmlContent, data);
    console.log('bodyHtml', bodyHtml);

    transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: bodyText,
      html: bodyHtml
    }, function(err, info) {
      if (err) errorCallback(err.message);
      successCallback(info);
    });
  } else {
    errorCallback('Must have to addresses(es), subject, and body');
  }
};
