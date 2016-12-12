'use strict';

/**
 * Module dependencies
 */
var remoteFilesPolicy = require('../policies/remote-files.server.policy'),
  remoteFiles = require('../controllers/remote-files.server.controller');

module.exports = function (app) {
  // Expedition Activity collection routes
  app.route('/api/remote-files/delete-file').all(remoteFilesPolicy.isAllowed)
    .post(remoteFiles.deleteFile);
  app.route('/api/remote-files/upload-wysiwyg-images').all(remoteFilesPolicy.isAllowed)
    .post(remoteFiles.uploadWysiwygImages);
};
