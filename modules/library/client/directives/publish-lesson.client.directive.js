(function() {
  'use strict';

  angular
    .module('library')
    .directive('publishLesson', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/library/client/views/publish-lesson.client.view.html',
        controller: 'PublishLessonsController',
        controllerAs: 'vm',
        scope: {
          lesson: '=',
          closeFunction: '='
        }
      };
    });
})();
