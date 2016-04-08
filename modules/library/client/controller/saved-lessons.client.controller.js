(function() {
  'use strict';

  angular
    .module('library')
    .controller('SavedLessonsController', SavedLessonsController);

  SavedLessonsController.$inject = ['$scope', 'SavedLessonsService', '$http'];

  function SavedLessonsController($scope, SavedLessonsService, $http) {
    var vm = this;

    vm.findSavedLessons = function() {
      SavedLessonsService.query({  
      }, function(data) {
        vm.savedLessons = data;
      });
    };

    vm.findSavedLessons();
  }
})();
