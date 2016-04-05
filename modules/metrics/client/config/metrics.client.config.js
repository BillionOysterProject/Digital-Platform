(function () {
  'use strict';

  angular
    .module('metrics')
    .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {
    Menus.addSubMenuItem('account', 'settings', {
      title: 'Metrics',
      state: 'metrics.dashboard'
    });
  }
})();
