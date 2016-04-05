(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope'];

  function MetricsController($scope) {
    var vm = this;

    vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    vm.series = ['Series A', 'Series B'];
    vm.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }
})();
