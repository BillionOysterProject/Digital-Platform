(function() {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .directive('formSubstrateShell', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/form-substrate-shell.client.view.html',
        scope: {
          substrate: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        link: function (scope, element, attrs) {
          element.bind("show.bs.modal", function () {
            scope.form.substrateForm.$setPristine();
            if (!scope.$$phase && !scope.$root.$$phase)
              scope.$apply();
          });
        }
      };
    });
})();
