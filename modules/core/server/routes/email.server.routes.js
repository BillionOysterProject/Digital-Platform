'use strict';

module.exports = function (app) {
  // Root routing
  var email = require('../controllers/email.server.controller');

  // Define error pages
  app.route('/api/email/bug-report').post(email.sendBugReport);

  app.route('/api/email/help').post(email.sendHelpQuestion);

  app.route('/api/email/general-feedback').post(email.sendGeneralFeedback);

  app.route('/api/email/unit-feedback').post(email.sendUnitFeedback);

  app.route('/api/email/share').post(email.sendShare);
};
