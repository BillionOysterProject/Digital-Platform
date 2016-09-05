(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('compareExpeditionWizard', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/compare-expedition-wizard.client.view.html',
        scope: {
        },
        replace: true,
        controller: 'ExpeditionsCompareController',
        controllerAs: 'ce',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.resetFilters();
          });

          scope.submitForm = function(organismDetails, isValid) {
          };
        }
      };
    });
})();
