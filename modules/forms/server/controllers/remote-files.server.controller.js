// 'use strict';
//
// /**
//  * Module dependencies
//  */
// var path = require('path'),
//   errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
//   UploadRemote = require(path.resolve('./modules/forms/server/controllers/upload-remote.server.controller')),
//   config = require(path.resolve('./config/config'));
//
// /**
//  * Delete a file
//  */
// exports.deleteFile = function(req, res) {
//   var filesToDelete = [];
//   if (req.body.fileToDelete) filesToDelete.push(req.body.fileToDelete);
//
//   if (filesToDelete.length > 0) {
//     var uploadRemote = new UploadRemote();
//     uploadRemote.deleteRemote(filesToDelete,
//     function() {
//       return res.status(200).send({
//         message: 'File was deleted'
//       });
//     }, function(err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     });
//   }
// };
