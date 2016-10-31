(function () {
  'use strict';

  angular
    .module('forms')
    .controller('FileDropzoneController', FileDropzoneController);

  FileDropzoneController.$inject = ['$scope', '$timeout', '$window', '$http', 'FileUploader'];

  function FileDropzoneController($scope, $timeout, $window, $http, FileUploader) {
    // // Set file uploader image filter
    // $scope.uploader.filters.push({
    //   name: 'imageFilter',
    //   fn: function (item, options) {
    //     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //     return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //   }
    // });

    // FILTERS
    $scope.uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        return this.queue.length <= 20;
      }
    });

    // CALLBACKS
    $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      //console.info('onWhenAddingFileFailed', item, filter, options);
      $scope.error = 'This file is invalid';
    };
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      //console.info('onAfterAddingFile', fileItem);
      //console.log('queue', $scope.uploader.queue);
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        //console.log('index', $scope.uploader.getIndexOfItem(fileItem));

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            //console.log('result', fileItem);
            console.log('files', $scope.files);
            $scope.files.push({
              originalname: fileItem.file.name,
              mimetype: fileItem.file.type,
              index: $scope.uploader.getIndexOfItem(fileItem)
            });
            $scope.error = '';
          }, 0);
        };
      }
    };
    // $scope.uploader.onAfterAddingAll = function(addedFileItems) {
    //   console.info('onAfterAddingAll', addedFileItems);
    // };
    // $scope.uploader.onBeforeUploadItem = function(item) {
    //   console.info('onBeforeUploadItem', item);
    // };
    // $scope.uploader.onProgressItem = function(fileItem, progress) {
    //   console.info('onProgressItem', fileItem, progress);
    // };
    // $scope.uploader.onProgressAll = function(progress) {
    //   console.info('onProgressAll', progress);
    // };
    // $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
    //   console.info('onSuccessItem', fileItem, response, status, headers);
    //   // Show success message
    //   $scope.success = true;

    //   // Clear upload buttons
    //   $scope.cancelUpload();
    // };
    // $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
    //   console.info('onErrorItem', fileItem, response, status, headers);
    //   // Clear upload buttons
    //   $scope.cancelUpload();

    //   // Show error message
    //   $scope.error = response.message;
    // };
    // $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
    //   console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
    //   console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // $scope.uploader.onCompleteAll = function() {
    //   console.info('onCompleteAll');
    // };

    // Cancel the upload process
    $scope.removeFile = function (index, file) {
      if (file.index !== undefined && file.index > -1) {
        $scope.uploader.removeFromQueue(file.index);
      }
      var filesToDelete = $scope.files.splice(index,1);
      if (filesToDelete.length === 1) {
        $http.post('/api/remote-files/delete-file', { path: filesToDelete[0].path })
        .success(function(data, status, headers, config) {
          console.log('data.message', data.message);
        })
        .error(function(data, status, headers, config) {
          console.log('data.message', data.message);
        });
      }
    };
  }
})();
