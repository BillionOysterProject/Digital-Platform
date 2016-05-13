(function() {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .directive('formSubstrateShell', function(moment) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/form-substrate-shell.client.view.html',
        scope: {
          substrate: '=',
          maxLiveOysters: '=',
          outerSubstrateUploader: '=',
          innerSubstrateUploader: '=',
          outerSubstrateUrl: '=',
          innerSubstrateUrl: '=',
          saveFunction: '=',
          cancelFunction: '=',
          index: '@'
        },
        replace: true,
        link: function (scope, element, attrs) {
          scope.dateTime = {
            min: moment().subtract(50, 'years').toDate(),
            max: moment().toDate()
          };
          if (!scope.substrate.setDate) {
            scope.substrate.setDate = moment().startOf('minute').toDate();
          } else {
            scope.substrate.setDate = moment(scope.substrate.setDate).startOf('minute').toDate();
          }

          element.bind('show.bs.modal', function () {
            scope.form.substrateForm.$setPristine();
          });
        },
        controller: ['$scope', function ($scope) {
          var validate = function() {
            $scope.error = [];
            var isValid = true;
            console.log('scope.outerSubstrateUrl', $scope.outerSubstrateUrl);
            if ($scope.outerSubstrateUrl === undefined || $scope.outerSubstrateUrl === null || $scope.outerSubstrateUrl === '') {
              //scope.form.substrateForm.$setValidity('outerImg', false);
              $scope.error.push('Outer substrate image is required');
              isValid = false;
            }
            if ($scope.innerSubstrateUrl === undefined || $scope.innerSubstrateUrl === null || $scope.innerSubstrateUrl === '') {
              //scope.form.substrateForm.$setValidity('innerImg', false);
              $scope.error.push('Inner substrate image is required');
              isValid = false;
            }
            return isValid;
          };

          $scope.submitForm = function(substrate, isValid) {
            $scope.error = [];
            if (!validate()) {
              $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
              return false;
            }
            $scope.saveFunction($scope.substrate, $scope.index, isValid);
          };

          $scope.$watch('outerSubstrateUrl', function(newValue, oldValue) {
            if ($scope.form.substrateForm.$submitted || ($scope.error && $scope.error.length > 0)) validate();
          });
          $scope.$watch('innerSubstrateUrl', function(newValue, oldValue) {
            if ($scope.form.substrateForm.$submitted || ($scope.error && $scope.error.length > 0)) validate();
          });
        }]
      };
    });
})();
