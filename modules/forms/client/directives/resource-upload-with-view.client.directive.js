(function() {
  'use strict';

  angular
    .module('forms')
    .directive('resourceUploadWithView', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/resource-upload-with-view.client.view.html',
        scope: {
          index: '@?',
          resourceFilesUploader: '=',
          resourceFiles: '=',
          resourceLinks: '=',
          resourceDropzoneId: '@',
          modalTitleText: '@',
          controlLabelText: '@',
          helpBlockText: '@',
          addButtonText: '@'
        },
        link: function (scope, element, attrs) {

        },
        controller: function($scope) {
          $scope.openAddModal = function() {
            angular.element('#modal-resources'+$scope.index).modal('show');
          };

          $scope.deleteResourceFile = function(index, file) {
            if (file.index !== undefined && file.index > -1) {
              $scope.resourceFilesUploader.removeFromQueue(file.index);
            }
            $scope.resourceFiles.splice(index,1);
          };

          $scope.deleteResourceLink = function(index) {
            $scope.resourceLinks.splice(index, 1);
          };

          $scope.closeFunction = function() {
            angular.element('#modal-resources'+$scope.index).modal('hide');
          };
        }
      };
    });
})();
