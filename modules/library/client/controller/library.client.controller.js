(function() {
  'use strict';

  angular
    .module('library')
    .controller('LibraryController', LibraryController);

  LibraryController.$inject = ['$scope', '$rootScope', 'LessonsService'];

  function LibraryController($scope, $rootScope, LessonsService) {
    var vm = this;

    vm.findCreatedLessons = function() {
      LessonsService.query({
        byCreator: true
      }, function(data) {
        vm.createdLessons = data;
      });
    };

    vm.findSubmittedLessons = function() {
      LessonsService.query({
        status: 'pending'
      }, function(data) {
        vm.submittedLessons = data;
      });
    };

    vm.findCreatedLessons();
    vm.findSubmittedLessons();

    vm.switchTab = function() {
      $rootScope.$broadcast('iso-method', { name:null, params:null });
    };
  }
})();
