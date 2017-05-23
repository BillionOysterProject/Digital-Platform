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
      roles: ['team member', 'team member pending', 'team lead', 'team lead pending', 'admin', 'partner', 'user'],
      icon: 'fa fa-file-text',
      position: 3
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'My Posters',
      state: 'researches.user',
      roles: ['team member', 'team lead', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'researches', {
      title: 'Publications',
      state: 'researches.list',
      roles: ['team member', 'team member pending', 'team lead', 'team lead pending', 'admin', 'partner', 'user'],
    });

    //Added temporarily to allow access to this view for mockup material
    //Menus.addSubMenuItem('topbar', 'researches', {
    //  title: 'Poster Mockup',
    //  state: 'researches.view'
    //});
  }
}());
