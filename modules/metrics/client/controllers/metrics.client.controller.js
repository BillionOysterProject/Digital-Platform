(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment'];

  function MetricsController($scope, $rootScope, $timeout, moment) {

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

    //month labels on timeline line charts are
    //a rolling window of the previous 8 months + current month
    vm.monthHistoryLabels = [];
    var labelMonthDate = moment().subtract(8, 'months');
    var nextMonth = moment().add(1, 'months').get('month');
    while(labelMonthDate.get('month') !== nextMonth) {
      vm.monthHistoryLabels.push(labelMonthDate.format('MMMM'));
      labelMonthDate = labelMonthDate.add(1, 'months');
    }

    //create a new array reverse order of the months array for dropdowns
    //so the most recent month shows up at the top of the dropdown
    vm.monthHistoryLabelsReversed = vm.monthHistoryLabels.slice().reverse();

    // vm.series = ['Team Members', 'Team Leads', 'Admin'];
    // vm.data = [
    //   [165, 159, 180, 181, 256, 257, 325],
    //   [18, 18, 20, 29, 36, 43, 45],
    //   [2, 2, 2, 2, 3, 3, 3, 3]
    // ];

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

    vm.rolesPielabels = ['Team Members', 'Team Leads', 'Admin'];

    vm.pieBlabels = ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
    vm.pieBdata = [43, 24, 142, 66, 35, 52, 35];

    vm.pieIlabels = ['Future Expeditions', 'Completed Expeditions'];
    vm.pieIdata = [52, 66];

    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }
})();
