(function () {
  'use strict';

  angular
     .module('curriculum')
     .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Curriculum',
      state: 'curriculum',
      type: 'dropdown',
      roles: ['admin', 'team lead', 'team lead pending', 'partner'],
      icon: 'glyphicon glyphicon-book',
      position: 2
    });

    //COMMENT OUT NODE GRAPH
    //Menus.addSubMenuItem('topbar', 'curriculum', {
    //  title: 'Overview',
    //  state: 'curriculum.overview',
    //  roles: ['team lead', 'admin'],
    //  position: 0
    //});
  }
})();
