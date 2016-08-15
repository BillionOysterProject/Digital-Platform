(function() {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .directive('formSubstrateShell', function(moment, $parse) {
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
          element.bind('show.bs.modal', function () {
            scope.form.substrateForm.$setPristine();

            if (!scope.substrate.setDate) {
              scope.substrate.setDate = moment().startOf('minute').toDate();
            } else {
              scope.substrate.setDate = moment(scope.substrate.setDate).startOf('minute').toDate();
            }
          });

          element.bind('hide.bs.modal', function () {
            if (!scope.$$phase && !scope.$root.$$phase)
              scope.$apply();
          });
        },
        controller: ['$scope', function ($scope) {
          $scope.dateTime = {
            min: moment().subtract(50, 'years').toDate(),
            max: moment().endOf('day').toDate()
          };

          $scope.sources = [
            { label: 'Muscongus Bay, Maine', value: 'Muscongus Bay, Maine' },
            { label: 'Fishers Island, New York', value: 'Fishers Island, New York' },
            { label: 'Soundview, New York', value: 'Soundview, New York' },
            { label: 'Bronx River, New York', value: 'Bronx River, New York' },
            { label: 'Tappan Zee, New York', value: 'Tappan Zee, New York' },
            { label: 'Hudson River, New York', value: 'Hudson River, New York' },
            { label: 'Other', value: 'Other' },
          ];

          var validate = function() {
            $scope.error = [];
            var isValid = true;
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

          $scope.updateMeasurementFields = function() {
            if ($scope.substrate.totalNumberOfLiveOystersOnShell > $scope.substrate.measurements.length) {
              for (var i = $scope.substrate.measurements.length; i < $scope.substrate.totalNumberOfLiveOystersOnShell; i++) {
                $scope.substrate.measurements.push({
                  sizeOfLiveOysterMM: null
                });
              }
            } else if ($scope.substrate.totalNumberOfLiveOystersOnShell < $scope.substrate.measurements.length) {
              $scope.substrate.measurements.splice($scope.substrate.totalNumberOfLiveOystersOnShell);
            }
          };

          $scope.submitForm = function(substrate, isValid) {
            $scope.error = [];
            if (!validate()) {
              $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
              return false;
            }
            $scope.substrate.outerSidePhoto = {
              path: $scope.outerSubstrateUrl
            };
            $scope.substrate.innerSidePhoto = {
              path: $scope.innerSubstrateUrl
            };
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
