'use strict';

module.exports = function (app) {
  // Root routing
  var feedback = require('../controllers/feedback.server.controller');

  // Define bug report
  app.route('/api/feedback/bug').get(feedback.bugReport);

  // Define feedback report
  app.route('/api/feedback/general').get(feedback.general);
};
