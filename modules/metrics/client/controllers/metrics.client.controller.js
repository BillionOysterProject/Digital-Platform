(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope'];

  function MetricsController($scope) {
    var vm = this;

    vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    vm.series = ['Team Members', 'Team Leads', 'Admin'];
    vm.data = [
      [165, 159, 180, 181, 256, 257, 325],
      [18, 18, 20, 29, 36, 43, 45],
      [2, 2, 2, 2, 3, 3, 3, 3]
    ];
    
    vm.pielabels = ['Team Members', 'Team Leads', 'Admin'];
    vm.piedata = [300, 500, 100];
    
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }
})();
