(function () {
  'use strict';

  angular
    .module('school-orgs')
    .controller('FormSchoolOrgController', FormSchoolOrgController);

  FormSchoolOrgController.$inject = ['$scope', '$http'];

  function FormSchoolOrgController($scope, $http) {
    $scope.save = function(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.schoolOrgForm');
        return false;
      }

      if ($scope.schoolOrg._id) {
        $scope.schoolOrg.$update(successCallback, errorCallback);
      } else {
        $scope.schoolOrg.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $scope.saveFunction($scope.schoolOrg);
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        $scope.error = res.data.message;
      }
    };
  }
})();
