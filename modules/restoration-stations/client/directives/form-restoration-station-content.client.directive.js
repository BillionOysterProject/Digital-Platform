(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationContent', function($timeout, lodash, $http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/restoration-stations/client/views/form-restoration-station-content.client.view.html',
        scope: {
          station: '=',
          mapPoints: '=',
          removeFunction: '=',
          closeFunction: '='
        },
        controller: 'RestorationStationsController',
        replace: true,
        link: function(scope, element, attrs) {
          scope.sites = [];

          var fuzzySearch = function(response) {
            angular.forEach(response, function(v, k) {
              if (v.bodyOfWater) {
                response[k].name = v.name + ', ' + v.bodyOfWater;
              }

              response[k]._search = response[k].name + ' ' + response[k].name.replace(/[\s\W]+/g, '').toLowerCase();
            });

            return response;
          };

          scope.normalizeSearch = function(q) {
            try {
              return q.replace(/[\s\W]+/g, '').toLowerCase();
            } catch(e) {
              return q;
            }
          };

          $http.get('https://platform-beta.bop.nyc/api/sites/?limit=false&fields=name,bodyOfWater&sort=name').success(function(response) {
            response = fuzzySearch(response);
            scope.sites = response;
          });

          scope.$on('orsForm', function() {
            scope.$broadcast('displayMapSelectContent');
            scope.form.restorationStationForm.$setSubmitted(false);
            scope.form.restorationStationForm.$setPristine();
          });

          scope.$watch('station', function(newValue, oldValue) {
            if (newValue) {
              scope.station = newValue;

              scope.teamId = (scope.station && scope.station.team && scope.station.team._id) ?
                scope.station.team._id : scope.station.team;

              scope.stationPhotoURL = (scope.station && scope.station.photo && scope.station.photo.path) ?
                scope.station.photo.path : '';

              if (scope.station && !scope.station.siteCoordinator && lodash.isEmpty(scope.station.otherSiteCoordinator)) {
                scope.station.siteCoordinator = {};
              } else if (scope.station && lodash.isEmpty(scope.station.siteCoordinator) &&
                scope.station.otherSiteCoordinator && !lodash.isEmpty(scope.station.otherSiteCoordinator)) {
                scope.station.siteCoordinator = { _id: '-1' };
                scope.station.siteCoordinator.displayName = scope.station.otherSiteCoordinator.name;
                scope.station.siteCoordinator.email = scope.station.otherSiteCoordinator.email;
              }

              if (scope.station && !scope.station.propertyOwner && lodash.isEmpty(scope.station.otherPropertyOwner)) {
                scope.station.propertyOwner = {};
              } else if (scope.station && lodash.isEmpty(scope.station.propertyOwner) &&
                scope.station.otherPropertyOwner && !lodash.isEmpty(scope.station.otherPropertyOwner)) {
                scope.station.propertyOwner = { _id: '-1' };
                scope.station.propertyOwner.name = scope.station.otherPropertyOwner.name;
                scope.station.propertyOwner.email = scope.station.otherPropertyOwner.email;
              }
            }
          });

        }
      };
    });
})();
