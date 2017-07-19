(function() {
  'use strict';

  angular
    .module('forms')
    .directive('resourceUploadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/resource-upload.client.view.html',
        scope: {
          index: '@?',
          modalTitleText: '@',
          resourceFilesUploader: '=',
          resourceFiles: '=',
          resourceLinks: '=',
          resourceDropzoneId: '@',
          closeFunction: '='
        },
        link: function (scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.tempResourceLinkName = '';
            scope.tempResourceLink = '';

            scope.tempResourceFiles = [];
          });

          scope.$watch('resourceFilesUploader', function(newValue, oldValue) {
            scope.resourceFilesUploader = newValue;
          });

          scope.$watch('resourceFiles', function(newValue, oldValue) {
            scope.resourceFiles = newValue;
          });

          scope.$watch('resourceLinks', function(newValue, oldValue) {
            scope.resourceLinks = newValue;
          });

          scope.$watch('resourceDropzoneId', function(newValue, oldValue) {
            scope.resourceDropzoneId = newValue;
          });
        },
        controller: 'ResourceUploadController',
      };
    });
})();
