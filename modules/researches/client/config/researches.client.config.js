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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'List Research',
      state: 'researches.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'Create Research',
      state: 'researches.create',
      roles: ['user']
    });
  }
}());
