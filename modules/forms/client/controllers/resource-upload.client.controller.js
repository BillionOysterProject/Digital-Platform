(function () {
  'use strict';

  angular
    .module('forms')
    .controller('ResourceUploadController', ResourceUploadController);

  ResourceUploadController.$inject = ['$scope'];

  function ResourceUploadController($scope) {
    $scope.tempResourceLinkName = '';
    $scope.tempResourceLink = '';

    $scope.tempResourceFiles = [];

    $scope.cancelResources = function() {
      $scope.tempResourceLinkName = '';
      $scope.tempResourceLink = '';

      $scope.tempResourceFiles = [];
      $scope.closeFunction();
    };

    $scope.addResources = function() {
      if ($scope.tempResourceLink) {
        $scope.resourceLinks.push({
          name: $scope.tempResourceLinkName,
          link: $scope.tempResourceLink
        });
        $scope.tempResourceLinkName = '';
        $scope.tempResourceLink = '';
      }
      if ($scope.tempResourceFiles.length > 0) {
        $scope.resourceFiles = $scope.resourceFiles.concat($scope.tempResourceFiles);
        $scope.tempResourceFiles = [];
      }
      $scope.closeFunction();
    };
  }
})();
