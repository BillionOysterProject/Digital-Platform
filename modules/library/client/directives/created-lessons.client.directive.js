(function() {
  'use strict';

  angular
    .module('library')
    .directive('createdLessons', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/library/client/views/created-lessons.client.view.html',
        controller: 'CreatedLessonsController',
        controllerAs: 'vm',
        scope: true
      };
    });
})();
