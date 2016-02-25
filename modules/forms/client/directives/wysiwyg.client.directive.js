(function() {
  'use strict';

  angular
    .module('forms')
    .directive('wysiwygEditor', function() {
      return {
        restrict: 'AE',
        template: '<div class="{{outerColumn}}">' +
          '<label for="{{name}}">{{inTitle}}</label>' +
          '<ng-quill-editor ng-model="outModel" name="{{name}}" toolbar="true" link-tooltip="true" image-tooltip="true" ' +
          'toolbar-entries="font size bold list bullet italic underline strike align color background link image" ' +
          'editor-required="true" required="{{required}}" error-class="input-error"></ng-quill-editor>' +
          '</div>',
        scope: {
          outModel: '=ngModel',
          inTitle: '@',
          outerColumn: '@',
          name: '@',
          required: '@'
        },
        require: 'ngModel',
        replace: true
      };
    });
})();
