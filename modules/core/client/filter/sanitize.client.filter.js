'use strict';

angular.module('core').filter('sanitize', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  };
});