(function() {
  'use strict';

  angular
    .module('library')
    .controller('SavedLessonsController', SavedLessonsController);

  SavedLessonsController.$inject = ['$scope', 'SavedLessonsService', '$http', '$timeout'];

  function SavedLessonsController($scope, SavedLessonsService, $http, $timeout) {
    var sv = this;

    sv.findSavedLessons = function() {
      SavedLessonsService.query({
      }, function(data) {
        sv.savedLessons = data;
        //$scope.$emit('iso-method', { name: null, params: null });
        $scope.$emit('iso-method', { name: 'reloadItems' });

        //$scope.$emit('iso-method', { name: 'layout', params: { sortBy: 'title' } });
        //$scope.$emit('iso-method', { name: null, params: { sortBy: 'title' } });
      });
    };

    sv.findSavedLessons();
  }
})();
