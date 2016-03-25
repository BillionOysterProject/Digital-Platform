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
      roles: ['team lead', 'admin'],
      position: 4
    });
  }
})();
