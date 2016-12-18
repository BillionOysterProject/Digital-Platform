(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope', '$rootScope', '$timeout'];

  function MetricsController($scope, $rootScope, $timeout) {

    // TODO: can we get this wired up to put in BOP colors? (doesn't work)
    // MetricsController.setOptions({ colors : [ '#000', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

    // TODO: says Chart is not defined
    //Chart.defaults.global.responsive = true;

    // TODO: also can this be wired up? (doesn't work)
    //Chart.defaults.global = {
    //animationSteps: 20, // to hopefully speed up animations
    //scaleFontFamily: "'Roboto'",
    //tooltipFontFamily: "'Roboto'",
    //tooltipTitleFontFamily: "'Roboto'"
    //}

    var vm = this;

    vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    vm.series = ['Team Members', 'Team Leads', 'Admin'];
    vm.data = [
      [165, 159, 180, 181, 256, 257, 325],
      [18, 18, 20, 29, 36, 43, 45],
      [2, 2, 2, 2, 3, 3, 3, 3]
    ];

    vm.Bseries = ['Units', 'Lessons'];
    vm.Bdata = [
      [2, 2, 2, 2, 3, 3, 4, 5],
      [118, 218, 220, 229, 236, 243, 258]
    ];

    vm.Cseries = ['Stations', 'Expeditions'];
    vm.Cdata = [
      [165, 159, 180, 181, 256, 257, 325],
      [218, 218, 220, 229, 256, 273, 358]
    ];

    vm.pielabels = ['Team Members', 'Team Leads', 'Admin'];
    //vm.piedata = [300, 500, 100];

    vm.pieBlabels = ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
    vm.pieBdata = [43, 24, 142, 66, 35, 52, 35];

    vm.pieElabels = ['Math', 'Science', 'Language Arts', 'Music', 'Environmental'];
    vm.pieEdata = [148, 100, 134, 42, 64];

    vm.pieGlabels = ['Lost Stations', 'Active Stations'];
    vm.pieGdata = [97, 248];

    vm.pieHlabels = ['Incomplete Protocols', 'Published Protocols'];
    vm.pieHdata = [497, 1948];

    vm.pieIlabels = ['Future Expeditions', 'Completed Expeditions'];
    vm.pieIdata = [52, 66];

    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }
})();
