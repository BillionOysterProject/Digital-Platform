(function() {
  'use strict';

  angular
    .module('forms')
    .directive('wysiwygEditor', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/wysiwyg-editor.client.directive.view.html',
        scope: {
          outModel: '=ngModel',
          inTitle: '@',
          outerColumn: '@',
          name: '@',
          required: '@',
          labelClass: '@'
        },
        require: 'ngModel',
        replace: true
      };
    });
})();
