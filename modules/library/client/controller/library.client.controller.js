(function() {
  'use strict';

  angular
    .module('library')
    .controller('LibraryController', LibraryController);

  LibraryController.$inject = ['$scope', '$rootScope', 'LessonsService', '$timeout'];

  function LibraryController($scope, $rootScope, LessonsService, $timeout) {
    var vm = this;
    vm.active = 'created';

    vm.findCreatedLessons = function() {
      LessonsService.query({
        byCreator: true
      }, function(data) {
        vm.createdLessons = data;

        if (vm.createdLessons.length > 0) {
          vm.switchTab('created');
        } else {
          vm.switchTab('saved');
        }
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

    vm.switchTab = function(activeTab) {
      vm.active = activeTab;
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };
  }
})();
