(function() {
  'use strict';

  angular
    .module('library')
    .controller('SubmittedLessonsController', SubmittedLessonsController);

  SubmittedLessonsController.$inject = ['$scope', '$rootScope', '$timeout', 'LessonsService', '$http'];

  function SubmittedLessonsController($scope, $rootScope, $timeout, LessonsService, $http) {
    var sub = this;

    sub.findSubmittedLessons = function() {
      LessonsService.query({
        status: 'pending'
      }, function(data) {
        sub.submittedLessons = data;
        $rootScope.$broadcast('iso-method', { name:null, params:null });
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        }, 100);
        //$scope.$emit('iso-method', { name: 'reloadItems' });
        //$scope.$emit('iso-method', { name: 'layout', params: null });
        //$scope.$emit('iso-method', { name: null, params: { sortBy: 'title' } });
      });
    };

    sub.findSubmittedLessons();

    sub.openReturnModal = function(lesson) {
      sub.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();
      angular.element('#modal-return').modal('show');
    };

    sub.closeReturnModal = function(refresh) {
      sub.lesson = {};
      angular.element('#modal-return').modal('hide');
      if (refresh) sub.findSubmittedLessons();
    };

    sub.openPublishModal = function(lesson) {
      sub.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();
      angular.element('#modal-accept').modal('show');
    };

    sub.closePublishModal = function(refresh) {
      sub.lesson = {};
      angular.element('#modal-accept').modal('hide');
      if (refresh) sub.findSubmittedLessons();
    };
  }
})();
