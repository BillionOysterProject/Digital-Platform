(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment', 'ChartJs'];

  function MetricsController($scope, $rootScope, $timeout, moment, ChartJsProvider) {

    ChartJsProvider.Chart.defaults.global.colours = [ '#000', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    ChartJsProvider.Chart.defaults.global.responsive = true;
    ChartJsProvider.Chart.defaults.global.animationSteps= 20;
    ChartJsProvider.Chart.defaults.global.scaleFontFamily = 'Roboto';
    ChartJsProvider.Chart.defaults.global.tooltipFontFamily = 'Roboto';
    ChartJsProvider.Chart.defaults.global.tooltipTitleFontFamily = 'Roboto';

    var vm = this;

    //not sure if we want behavior on click?
    // vm.onClick = function (points, evt) {
    //   console.log(points, evt);
    // };
  }
})();
