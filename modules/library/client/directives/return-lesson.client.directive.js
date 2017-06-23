(function() {
  'use strict';

  angular
    .module('library')
    .directive('returnLesson', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/library/client/views/return-lesson.client.view.html',
        controller: 'ReturnLessonsController',
        controllerAs: 'vm',
        scope: {
          lesson: '=',
          closeFunction: '='
        }
      };
    });
})();
