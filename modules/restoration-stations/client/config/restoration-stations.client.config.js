(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Restoration Stations',
      state: 'restoration-stations',
      type: 'dropdown',
      roles: ['team lead', 'team member', 'partner', 'admin'],
      icon: 'glyphicon glyphicon-map-marker',
      position: 2
    });

    Menus.addSubMenuItem('topbar', 'restoration-stations', {
      title: 'Dashboard',
      state: 'restoration-stations.dashboard',
      roles: ['team lead', 'team member', 'partner', 'admin'],
      position: 1
    });

    //Menus.addSubMenuItem('topbar', 'restoration-stations', {
    //  title: 'Stations',
    //  state: 'restoration-stations.list',
    //  roles: ['team lead', 'team member', 'partner', 'admin'],
    //  position: 2
    //});

    Menus.addSubMenuItem('topbar', 'restoration-stations', {
      title: 'Expeditions',
      state: 'expeditions.list',
      roles: ['team lead', 'team member', 'partner', 'admin'],
      position: 2
    });

    Menus.addSubMenuItem('topbar', 'restoration-stations', {
      title: 'Submissions',
      state: 'expeditions.submitted',
      roles: ['team lead', 'partner', 'admin'],
      position: 3
    });
  }
})();
