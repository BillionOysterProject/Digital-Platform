(function() {
  'use strict';

  angular
    .module('forms')
    .directive('imageDropZone', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/image-dropzone.client.view.html',
        scope: {
          file: '@',
          fileName: '@',
          url: '@',
          alias: '@',
          imageURL: '@',
          imageAlt: '@'
        }, 
        controller: 'ImageDropzoneController',
        controllerAs: 'vm'
      };
    });
})();
