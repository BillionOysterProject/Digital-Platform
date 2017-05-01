(function() {
  'use strict';

  angular
    .module('researches')
    .directive('researchFeedbackViewModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/researches/client/views/research-feedback-view.client.view.html',
        scope: {
          research: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'ResearchFeedbackController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.getFeedback();
          });
        }
      };
    });
})();
