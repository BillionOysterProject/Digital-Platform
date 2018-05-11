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
          stationId: '@',
          baseline: '=',
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
            scope.editBaseline();
          });

          element.bind('hide.bs.modal', function () {
            if (!scope.$$phase && !scope.$root.$$phase)
              scope.$apply();
          });
        },
        controller: ['$scope', '$http', function ($scope, $http) {
          if (!$scope.baseline.substrateShellNumber) $scope.baseline.substrateShellNumber = $scope.substrate.substrateShellNumber;
          $scope.readonlyBaseline = ($scope.baseline && $scope.baseline.setDate) ? true : false;
          $scope.editing = false;
          if ($scope.baseline) {
            $scope.baseline.setDate = moment($scope.baseline.setDate).startOf('day').toDate();
          }

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

            return isValid;
          };

          $scope.editBaseline = function() {
            $scope.tempBaseline = angular.copy($scope.baseline);
            $scope.readonlyBaseline = false;
            $scope.editing = true;
          };

          $scope.cancelEditingBaseline = function() {
            $scope.baseline = angular.copy($scope.tempBaseline);
            $scope.readonlyBaseline = ($scope.baseline && $scope.baseline.setDate) ? true : false;
            $scope.editing = false;
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

            var saveSubstrateShell = function() {
              $scope.substrate.outerSidePhoto = {
                path: $scope.outerSubstrateUrl
              };
              $scope.substrate.innerSidePhoto = {
                path: $scope.innerSubstrateUrl
              };
              $scope.saveFunction($scope.substrate, $scope.index, isValid);
            };

            var saveBaselineHistory = function(callback) {
              $http.post('/api/restoration-stations/' + $scope.stationId + '/substrate-history',
              $scope.baseline)
              .success(function (data, status, headers, config) {
                $scope.baseline = data;
                $scope.baseline.setDate = moment($scope.baseline.setDate).startOf('day').toDate();
                callback();
              })
              .error(function (data, status, headers, config) {
                $scope.error.push('Could not save new baseline information.');
                $scope.$broadcast('show-errors-check-validity', 'form.substrateForm');
                return false;
              });
            };

            if ($scope.editing) {
              saveBaselineHistory(function() {
                saveSubstrateShell();
              });
            } else {
              saveSubstrateShell();
            }
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
