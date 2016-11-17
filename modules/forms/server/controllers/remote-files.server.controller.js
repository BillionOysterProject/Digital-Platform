'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Delete a file
 */
exports.deleteFile = function(req, res) {
  var filesToDelete = [];
  if (req.body.path) filesToDelete.push(req.body.path);

  if (filesToDelete.length > 0) {
    var uploadRemote = new UploadRemote();
    uploadRemote.deleteRemote(filesToDelete,
    function() {
      return res.status(200).send({
        message: 'File was deleted'
      });
    }, function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};

exports.uploadWysiwygImages = function(req, res) {
  var upload = multer(config.uploads.wysiwygImageUploader).single('newWysiwygImage');
  var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = imageUploadFileFilter;

  var uploadRemote = new UploadRemote();
  uploadRemote.uploadLocalAndRemote(req, res, upload, config.uploads.wysiwygImageUploader,
  function(fileInfo) {
    console.log('fileInfo', fileInfo);
    res.json(fileInfo);
  }, function(errorMessage) {
    console.log('errorMessage', errorMessage);
    return res.status(400).send({
      message: errorMessage
    });
  });
};
