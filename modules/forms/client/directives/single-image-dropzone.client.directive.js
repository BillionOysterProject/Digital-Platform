(function() {
  'use strict';

  angular
    .module('forms')
    .directive('singleImageDropZone', function($timeout) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/single-image-dropzone.client.view.html',
        scope: {
          uploader: '=',
          imageUrl: '=',
          imageAlt: '@',
          id: '@'
        },
        controller: 'ImageDropzoneController',
        controllerAs: 'vm'
      };
    });
})();
