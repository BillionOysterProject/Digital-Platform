(function () {
  'use strict';

  angular
    .module('restoration-station')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Restoration Stations',
      state: 'restoration-station',
      roles: ['user'],
      icon: 'glyphicon glyphicon-map-marker',
      position: 2
    });
  }
})();
