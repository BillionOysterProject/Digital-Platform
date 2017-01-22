'use strict';
// // ====================================================================================================
// // Isotope ImagesLoaded
// // ====================================================================================================

angular.module('core')
  .directive('imagesLoaded', function($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $elem, $attr) {

        var checkImagesLoaded = function(isoInstance, laidOutItems) {
          $elem.imagesLoaded()
          //if all images are loaded, re-layout the isotopes so that they
          //can resize themselves leaving room for the images.
          //this listener will keep firing forever so turn it off when we are done
            .always(function(instance) {
              if(instance && instance.images && instance.images.length > 0) {
                $elem.isotope('off', 'layoutComplete', checkImagesLoaded);
                $elem.isotope('layout');
              }
            }
          );
        };

        $timeout(function() {
          //when the layoutComplete event fires from the isotope parent,
          //see if all images are loaded.
          $elem.isotope();
          $elem.isotope('on', 'layoutComplete', checkImagesLoaded);
        }, 0);
      }
    };
  }
);
