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
      title: 'My Posters',
      state: 'researches.user'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'Publications',
      state: 'researches.list',
      roles: ['*']
    });

    //Added temporarily to allow access to this view for mockup material
    //Menus.addSubMenuItem('topbar', 'researches', {
    //  title: 'Poster Mockup',
    //  state: 'researches.view'
    //});
  }
}());
