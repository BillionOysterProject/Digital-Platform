(function() {
  'use strict';

  angular
    .module('library')
    .directive('savedLessons', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/library/client/views/saved-lessons.client.view.html',
        controller: 'SavedLessonsController',
        controllerAs: 'sv',
        scope: {

        }
      };
    });
})();
