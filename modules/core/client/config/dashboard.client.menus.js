(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Dashboard',
    //   state: 'home',
    //   roles: ['user'],
    //   icon: 'glyphicon glyphicon-home',
    //   position: 0
    // });
  }
})();
