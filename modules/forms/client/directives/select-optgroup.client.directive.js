(function() {
  'use strict';

  angular
    .module('forms')
    .directive('selectOptgroup', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/select-optgroup.client.view.html',
        scope: {
          outModel: '=ngModel',
          inTitle: '@',
          outerColumn: '@',
          name: '@',
          required: '@',
          labelClass: '@',
          options: '@'
        },
        require: 'ngModel',
        replace: true
      };
    });
})();