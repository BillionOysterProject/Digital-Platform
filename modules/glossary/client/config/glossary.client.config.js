(function () {
  'use strict';

  angular
    .module('glossary')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Glossary',
      state: 'glossary.main',
      roles: ['admin', 'team lead', 'team lead pending', 'partner'],
      position: 4
    });
  }
})();
