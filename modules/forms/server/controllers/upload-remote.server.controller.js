'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config'));

function UploadRemote() {
  /**
   * Set up s3 client
   */
  this.client = require('s3').createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 30*1024*1024, // this is the default (20 MB)
    multipartUploadSize: 25*1024*1024, // this is the default (15 MB)
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: config.s3.region,
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
  });

  this.remoteUrl = 'http://s3-' + config.s3.region + '.amazonaws.com/' + config.s3.bucket + '/';
}

var saveLocalToRemote = function(vm, localFileName, file, uploadConfig, successCallback, errorCallback) {
  var pathExt = path.extname(file.originalname);
  var s3Filename = vm.remoteUrl + uploadConfig.s3dest + file.filename + pathExt;

  //console.log('key', uploadConfig.s3dest + file.filename + pathExt);
  var params = {
    localFile: localFileName,
    s3Params: {
      Bucket: config.s3.bucket,
      Key: uploadConfig.s3dest + file.filename + pathExt
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    }
  };

  // Upload file to s3
  var s3Uploader = vm.client.uploadFile(params);

  // Listen for stage changes on the call
  s3Uploader.on('error', function(err) {
    //console.error('unable to upload:', err.stack);
    errorCallback(err.stack);
  })
  .on('progress', function() {
    //console.log('progress', s3Uploader.progressMd5Amount, s3Uploader.progressAmount, s3Uploader.progressTotal);
  })
  .on('fileOpened', function() {
    //console.log('File Opened');
  })
  .on('end', function() {
    //console.log('done uploading');
  })
  .on('fileClosed', function() {
    //console.log('File Closed');
    var fileInfo = {
      path: s3Filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      filename: file.filename
    };

    fs.exists(localFileName, function(exists) {
      if(exists) {
        fs.unlink(localFileName);
        successCallback(fileInfo);
      } else {
        errorCallback('Local file is missing');
      }
    });
  });
};

/**
 * Upload file to local storage, upload to s3, then delete from local storage
 */
UploadRemote.prototype.uploadLocalAndRemote = function(req, res, localUploader, uploadConfig, successCallback, errorCallback) {
  var vm = this;
  if (req && res && localUploader && uploadConfig) {
    localUploader(req, res, function(localUploadError) {
      if (localUploadError) {
        //console.log('localUploadError', localUploadError.code);
        errorCallback(localUploadError.code);
      } else {
        if (req.file) {
          var localFileName = uploadConfig.dest + req.file.filename;
          saveLocalToRemote(vm, localFileName, req.file, uploadConfig, successCallback, errorCallback);
        } else {
          errorCallback('No file for uploading');
        }
      }
    });
  } else {
    errorCallback('Must have an uploader');
  }
};

UploadRemote.prototype.saveLocalAndRemote = function(filename, mimetype, uploadConfig, successCallback, errorCallback) {
  var vm = this;
  if (filename && mimetype && uploadConfig) {
    var localFileName = uploadConfig.dest + filename;
    saveLocalToRemote(vm, localFileName, {
      originalname: filename,
      mimetype: mimetype,
      filename: path.parse(filename).name,
    }, uploadConfig, successCallback, errorCallback);
  } else {
    errorCallback('Must have file and config');
  }
};

UploadRemote.prototype.deleteRemote = function(filePaths, successCallback, errorCallback) {
  var vm = this;
  if (filePaths) {
    var s3Params = {
      Bucket: config.s3.bucket,
      Delete: {
        Objects: [],
      }
    };

    for (var i = 0; i < filePaths.length; i++) {
      var filePath = filePaths[i];
      var key = _.replace(filePath, vm.remoteUrl, '');
      s3Params.Delete.Objects.push({ Key: key });
    }

    //console.log('params', s3Params);

    // Delete files in s3
    var s3Deleter = vm.client.deleteObjects(s3Params);

    // Listen for stage changes on the call
    s3Deleter.on('error', function(err) {
      //console.error('unable to upload:', err.stack);
      errorCallback(err.stack);
    })
    .on('progress', function() {
      //console.log('progress', s3Deleter.progressMd5Amount, s3Deleter.progressAmount, s3Deleter.progressTotal);
    })
    .on('data', function() {
      //console.log('data');
    })
    .on('end', function() {
      //console.log('done deleting');
      successCallback();
    });
  } else {
    errorCallback('Must have an uploader');
  }
};

module.exports = UploadRemote;
