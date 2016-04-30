(function() {
  'use strict';

  angular
    .module('library')
    .controller('SavedLessonsController', SavedLessonsController);

  SavedLessonsController.$inject = ['$scope', 'SavedLessonsService', '$http'];

  function SavedLessonsController($scope, SavedLessonsService, $http) {
    var sv = this;

    sv.findSavedLessons = function() {
      SavedLessonsService.query({
      }, function(data) {
        sv.savedLessons = data;
        $scope.$emit('iso-method', { name: null, params: null });
      });
    };

    sv.findSavedLessons();
  }
})();
