(function () {
  'use strict';

  angular
    .module('forms')
    .controller('ImageDropzoneController', ImageDropzoneController);

  ImageDropzoneController.$inject = ['$scope', '$timeout', '$window', 'FileUploader'];

  function ImageDropzoneController($scope, $timeout, $window, FileUploader) {
    console.log($scope.url);
    console.log($scope.alias);

    $scope.uploader = new FileUploader({
      url: $scope.url,
      alias: $scope.alias
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // FILTERS
    $scope.uploader.filters.push({
      name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          return this.queue.length < 10;
        }
      });

    // CALLBACKS
    // $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    //   console.info('onWhenAddingFileFailed', item, filter, options);
    // };
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      $scope.file = fileItem._file;
      $scope.fileName = fileItem.file.name;
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
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
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      // Show success message
      $scope.success = true;

      // Clear upload buttons
      $scope.cancelUpload();
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };
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
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = '';
    };

    console.info('uploader', $scope.uploader);
  }
})();
