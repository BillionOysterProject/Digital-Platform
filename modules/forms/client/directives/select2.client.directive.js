(function() {
  'use strict';

  angular
    .module('forms')
    .directive('select2', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/select2.client.view.html',
        scope: {
          outModel: '=ngModel',
          inTitle: '@'
        },
        require: 'ngModel',
        replace: true,
        link: function (scope, element, attrs) {
          scope.$watch('$viewContentLoaded', function(event) {
            $(function () {
              $('.select2').select2();
              $('.select2create').select2({
                tags: true
              });
            });
          });
        }
      };
    });
})();