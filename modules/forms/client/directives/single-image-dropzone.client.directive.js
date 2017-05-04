(function() {
  'use strict';

  angular
    .module('forms')
    .directive('singleImageDropZone', function($timeout, $rootScope) {
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
        controllerAs: 'vm',
        link: function(scope, element, attrs) {
          angular.element('#single-image-dropzone-uploader').on('drop', function(event, data) {
            $rootScope.$broadcast('dropFromImageDrop');
          });
        }
      };
    });
})();
