(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('returnExpeditionModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/expeditions/client/views/return-expedition.client.view.html',
        controller: 'ReturnExpeditionController',
        controllerAs: 'vm',
        scope: {
          saveFunction: '=',
          cancelFunction: '='
        }
      };
    });
})();
