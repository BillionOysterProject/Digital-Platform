(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment'];

  function MetricsController($scope, $rootScope, $timeout, moment) {

    // TODO: can we get this wired up to put in BOP colors? (doesn't work)
    // MetricsController.setOptions({ colors : [ '#000', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

    // // TODO: says Chart is not defined
    // Chart.defaults.global.responsive = true;
    //
    // // TODO: also can this be wired up? (doesn't work)
    // Chart.defaults.global = {
    //   animationSteps: 20, // to hopefully speed up animations
    //   scaleFontFamily: "'Roboto'",
    //   tooltipFontFamily: "'Roboto'",
    //   tooltipTitleFontFamily: "'Roboto'"
    // };

    var vm = this;

    // vm.series = ['Team Members', 'Team Leads', 'Admin'];
    // vm.data = [
    //   [165, 159, 180, 181, 256, 257, 325],
    //   [18, 18, 20, 29, 36, 43, 45],
    //   [2, 2, 2, 2, 3, 3, 3, 3]
    // ];

    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }
})();
