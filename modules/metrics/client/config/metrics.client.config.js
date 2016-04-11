(function () {
  'use strict';

  angular
    .module('metrics')
    .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

   // COMMENTED OUT FOR STAGING:
   // Menus.addSubMenuItem('account', 'settings', {
   //   title: 'Metrics',
   //   state: 'metrics.dashboard',
   //   roles: ['admin']
   // });

  }
})();
