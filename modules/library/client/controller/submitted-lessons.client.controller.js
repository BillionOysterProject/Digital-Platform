(function() {
  'use strict';

  angular
    .module('library')
    .controller('SubmittedLessonsController', SubmittedLessonsController);

  SubmittedLessonsController.$inject = ['$scope', 'LessonsService', '$http'];

  function SubmittedLessonsController($scope, LessonsService, $http) {
    var vm = this;

    vm.findSubmittedLessons = function() {
      LessonsService.query({
        status: 'pending'
      }, function(data) {
        vm.submittedLessons = data;
        $scope.$emit('iso-method', { name: 'reloadItems' });
      });
    };

    vm.findSubmittedLessons();

    vm.openReturnModal = function(lesson) {
      vm.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();

      angular.element('#modal-return').modal('show');
    };

    vm.returnModal = function() {
      vm.lesson = {};
      angular.element('#modal-return').modal('hide');
      vm.findSubmittedLessons();
    };

    vm.closeReturnModal = function() {
      vm.lesson = {};
      angular.element('#modal-return').modal('hide');
    };

    vm.openPublishModal = function(lesson) {
      vm.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();

      angular.element('#modal-accept').modal('show');
    };

    vm.publishModal = function() {
      vm.lesson = {};
      angular.element('#modal-accept').modal('hide');
      vm.findSubmittedLessons();
    };

    vm.closePublishModal = function() {
      vm.lesson = {};
      angular.element('#modal-accept').modal('hide');
    };
  }
})();
