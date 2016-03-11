(function() {
  'use strict';

  angular
    .module('forms')
    .directive('singleImageDropZone', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/single-image-dropzone.client.view.html',
        scope: {
          uploader: '=',
          imageUrl: '=',
          imageAlt: '@'
        }, 
        controller: 'ImageDropzoneController',
        controllerAs: 'vm'
      };
    });
})();
