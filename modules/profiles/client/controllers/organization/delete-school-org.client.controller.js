(function() {
  'use strict';

  angular
    .module('school-orgs')
    .controller('SchoolOrganizationDeleteController', SchoolOrganizationDeleteController);

  SchoolOrganizationDeleteController.$inject = ['$scope', '$http', 'SchoolOrganizationsService'];

  function SchoolOrganizationDeleteController($scope, $http, SchoolOrganizationsService) {
    $scope.delete = function() {
      $scope.organization.$remove(function() {
        $scope.closeFunction(true);
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
