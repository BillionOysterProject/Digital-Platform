'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  ses = require('nodemailer-ses-transport');

var from = process.env.MAILER_FROM || 'bop@fearless.tech';

var transporter = nodemailer.createTransport(ses(config.mailer.options.ses));

/**
 * Send email
 */
exports.sendEmail = function(to, subject, bodyText, bodyHtml, successCallback, errorCallback) {
  if (to && subject && bodyText && bodyHtml) {
    if (_.isArray(to)) {
      to = to.join(', ');
    }

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
