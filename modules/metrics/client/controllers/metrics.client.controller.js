(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('MetricsController', MetricsController);

  MetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment', 'lodash',
    'ChartJs', 'Authentication'];

  function MetricsController($scope, $rootScope, $timeout, moment, lodash,
    ChartJsProvider, Authentication) {

    ChartJsProvider.Chart.defaults.global.colours = [ '#426ca9', '#ea6158', '#2c3c56', '#a0d0cb', '#ff9501', '#943234', '#4CAF50'];
    ChartJsProvider.Chart.defaults.global.responsive = true;
    ChartJsProvider.Chart.defaults.global.animationSteps= 20;
    ChartJsProvider.Chart.defaults.global.scaleFontFamily = 'Roboto';
    ChartJsProvider.Chart.defaults.global.tooltipFontFamily = 'Roboto';
    ChartJsProvider.Chart.defaults.global.tooltipTitleFontFamily = 'Roboto';

    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;

    vm.status = {
      isopen: false
    };

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    if(vm.user) {
      vm.isAdmin = checkRole('admin');
    } else {
      vm.isAdmin = false;
    }
  }
})();
