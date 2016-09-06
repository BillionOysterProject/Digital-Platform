(function() {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .directive('formOrganismDetails', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-mobile-traps/client/views/form-organism-details.client.view.html',
        scope: {
          organismDetails: '=',
          sketchPhotoUploader: '=',
          sketchPhotoUrl: '=',
          saveFunction: '=',
          cancelFunction: '=',
          organismId: '@'
        },
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.organismDetailsForm.$setPristine();
          });

          scope.submitForm = function(organismDetails, isValid) {
            if (scope.organismDetails.organism.commonName === 'Other/Unknown' &&
            (scope.sketchPhotoUrl === undefined || scope.sketchPhotoUrl === null || scope.sketchPhotoUrl === '')) {
              scope.form.organismDetailsForm.$setValidity('sketchPhoto', false);
              return false;
            }

            organismDetails.imageUrl = scope.sketchPhotoUrl;

            scope.saveFunction(organismDetails, scope.organismId, true);
          };
        }
      };
    });
})();
