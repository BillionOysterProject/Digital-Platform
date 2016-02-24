(function() {
  'use strict';

  angular
    .module('forms')
    .directive('wysiwygEditor', function() {
      return {
        restrict: 'AE',
        template: '<div class="{{outerColumn}}">' +
          '<label for="{{linTitle}}">{{inTitle}}</label>' +
          '<ng-quill-editor ng-model="outModel" toolbar="true" link-tooltip="true" image-tooltip="true" ' +
          'toolbar-entries="font size bold list bullet italic underline strike align color background link image" ' +
          'editor-required="true" required="" error-class="input-error"></ng-quill-editor>' +
          '</div>',
        scope: {
          outModel: '=ngModel',
          inTitle: '@',
          outerColumn: '@'
        },
        require: 'ngModel',
        replace: true
      };
    });
})();
