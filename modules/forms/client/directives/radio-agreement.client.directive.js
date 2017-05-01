(function() {
  'use strict';

  angular
    .module('forms')
    .directive('radioAgreement', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/forms/client/views/radio-agreement.client.view.html',
        scope: {
          outModel: '=ngModel',
          name: '@'
        },
        require: 'ngModel',
        replace: true
      };
    });
})();
