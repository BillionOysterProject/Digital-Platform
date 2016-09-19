(function() {
  'use strict';

  angular
    .module('forms')
    .directive('resourceUploadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/resource-upload.client.view.html',
        scope: {
          resourceFilesUploader: '=',
          resourceFiles: '=',
          resourceLinks: '=',
          closeFunction: '='
        },
        link: function (scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.tempResourceLinkName = '';
            scope.tempResourceLink = '';

            scope.tempResourceFiles = [];
          });
        },
        controller: 'ResourceUploadController',
      };
    });
})();
