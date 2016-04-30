(function() {
  'use strict';

  angular
    .module('library')
    .directive('submittedLessons', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/library/client/views/submitted-lessons.client.view.html',
        controller: 'SubmittedLessonsController',
        controllerAs: 'sub',
        scope: {
          
        }
      };
    });
})();
