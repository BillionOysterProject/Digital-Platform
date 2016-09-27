(function() {
  'use strict';

  angular
    .module('forms')
    .directive('multipleFileDropZone', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/multiple-file-dropzone.client.view.html',
        scope: {
          uploader: '=',
          files: '=',
          id: '@'
        },
        controller: 'FileDropzoneController',
        controllerAs: 'vm'
      };
    });
})();
