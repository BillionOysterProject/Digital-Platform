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
          maxLiveOysters: '=',
          outerSubstrateUploader: '=',
          innerSubstrateUploader: '=',
          outerSubstrateUrl: '=',
          innerSubstrateUrl: '=',
          saveFunction: '=',
          cancelFunction: '=',
          index: '@'
        },
        replace: true,
        link: function (scope, element, attrs) {
          element.bind("show.bs.modal", function () {
            scope.form.substrateForm.$setPristine();
          });

          scope.submitForm = function(substrate, isValid) {
            if (scope.outerSubstrateUrl === undefined || scope.outerSubstrateUrl === null || scope.outerSubstrateUrl === '') {
              scope.form.substrateForm.$setValidity("outerImg", false);
              isValid = false;
            }
            if (scope.innerSubstrateUrl === undefined || scope.innerSubstrateUrl === null || scope.innerSubstrateUrl === '') {
              scope.form.substrateForm.$setValidity("innerImg", false);
              isValid = false;
            }
            scope.saveFunction(substrate, scope.index, isValid);
          };
        }
      };
    });
})();
