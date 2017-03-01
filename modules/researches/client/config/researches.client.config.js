(function () {
  'use strict';

  angular
    .module('researches')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Research',
      state: 'researches',
      type: 'dropdown',
      roles: ['*'],
      icon: 'fa fa-file-text',
      position: 3
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'Posters',
      state: 'researches.list'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'My Collection',
      state: 'researches.user'
    });
  }
}());
